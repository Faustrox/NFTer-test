<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class NftData extends Data
{
    public function __construct(
        public string $userId,
        public string $token,
        public string $title,
        public string $imageUrl,
        public string $thumbnailUrl,
        public string $collectionName,
        public string|null $collectionImage,
        public string|null $externalUrl,
    ) {
    }
}
