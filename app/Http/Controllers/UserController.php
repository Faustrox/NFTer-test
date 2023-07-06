<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getNfts(Request $request, $address)
    {

        $user = User::where('address', $address)->first();

        if (!$user) {
          return response()->json(['message' => 'User not found'], 404);
        }

        $nfts = $user->nfts()->get();

        return response()->json($nfts);
    }

}
