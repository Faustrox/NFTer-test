<?php

namespace App\Services\Providers;

use App\Models\Nft;

class Alchemy implements AbstractProvider
{
    /**
     * @param  string  $address
     *
     * @return array<Nft>
     */
    public function getNfts(string $address): array
    {
        // TODO: implement
        return [];
    }
}
