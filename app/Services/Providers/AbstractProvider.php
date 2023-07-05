<?php

namespace App\Services\Providers;

use App\Models\Nft;
use Exception;

interface AbstractProvider
{
    /**
     * @param  string  $address
     *
     * @return array<Nft>
     * @throws Exception
     */
    public function getNfts(string $address): array;
}
