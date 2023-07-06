<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {

        // Authenticate the user based on MetaMask address
        $user = User::where('address', $request->get('address'))->first();
        $input = $request->all();
        
        if(!$user){
            $user = User::create(['address' => $input['address']]);
        }
        $existingNfts = $user->nfts()->get();

        if (count($existingNfts) === 0) {

            $response = Http::get(env('ALCHEMY_API_URI') . '/' . env('ALCHEMY_API_KEY') . '/getNFTs' . '?owner=' . env('ADDRESS_TO_TEST', $input['address']));

            $nfts = $response->json()['ownedNfts'];

            if (count($user->nfts()->get()) === 0) {
                foreach ($nfts as &$nft) {
                    $words = explode(" ", $nft['title']);
                    $nftColName = trim($words[0]);
                    $token = trim(str_replace("#", "", strstr($nft['title'], "#")));
                    $nftMetadata = $nft['metadata'];
                    $defaultNftImage = 'https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0=';
                    $nftFiltered = [
                        'token' => $token,
                        'image_url' => isset($nftMetadata['image']) && strpos($nftMetadata['image'], 'ipfs') !== 0 ? $nftMetadata['image'] : $defaultNftImage,
                        'collection_name' => $nftColName,
                        'collection_image' => isset($nftMetadata['image']) && strpos($nftMetadata['image'], 'ipfs') !== 0 ? $nftMetadata['image'] : $defaultNftImage,
                        'external_url' => isset($nftMetadata['external_url']) ? $nftMetadata['external_url'] : '',
                    ];
                    $user->nfts()->create($nftFiltered);
                }

            
            };
        }

        // Log in the user
        auth()->login($user);

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
