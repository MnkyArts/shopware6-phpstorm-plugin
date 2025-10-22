export interface PluginMetadata {
    name: string;
    namespace: string;
    description: string;
    author: string;
    license: string;
    version: string;
}

export function getPluginBaseClassTemplate(metadata: PluginMetadata): string {
    return `<?php declare(strict_types=1);

namespace ${metadata.namespace};

use Shopware\\Core\\Framework\\Plugin;

class ${metadata.name} extends Plugin
{
}
`;
}

export function getComposerJsonTemplate(metadata: PluginMetadata): string {
    const packageName = metadata.name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    
    return `{
    "name": "${metadata.author.toLowerCase()}/${packageName}",
    "description": "${metadata.description}",
    "type": "shopware-platform-plugin",
    "license": "${metadata.license}",
    "version": "${metadata.version}",
    "autoload": {
        "psr-4": {
            "${metadata.namespace}\\\\": "src/"
        }
    },
    "extra": {
        "shopware-plugin-class": "${metadata.namespace}\\\\${metadata.name}",
        "label": {
            "de-DE": "${metadata.description}",
            "en-GB": "${metadata.description}"
        },
        "description": {
            "de-DE": "${metadata.description}",
            "en-GB": "${metadata.description}"
        }
    }
}
`;
}

export function getServicesXmlTemplate(metadata: PluginMetadata): string {
    return `<?xml version="1.0" ?>
<container xmlns="http://symfony.com/schema/dic/services"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd">

    <services>
        <!-- Register your services here -->
    </services>
</container>
`;
}
