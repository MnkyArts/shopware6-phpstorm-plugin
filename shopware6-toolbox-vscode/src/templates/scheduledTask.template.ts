export function getScheduledTaskTemplate(
    namespace: string,
    className: string,
    taskName: string
): string {
    return `<?php declare(strict_types=1);

namespace ${namespace};

use Shopware\\Core\\Framework\\MessageQueue\\ScheduledTask\\ScheduledTask;

class ${className} extends ScheduledTask
{
    public static function getTaskName(): string
    {
        return '${taskName}';
    }

    public static function getDefaultInterval(): int
    {
        return 300; // 5 minutes
    }
}
`;
}

export function getScheduledTaskHandlerTemplate(
    namespace: string,
    className: string,
    handlerName: string,
    taskClassName: string
): string {
    return `<?php declare(strict_types=1);

namespace ${namespace};

use Shopware\\Core\\Framework\\MessageQueue\\ScheduledTask\\ScheduledTaskHandler;

class ${handlerName} extends ScheduledTaskHandler
{
    public static function getHandledMessages(): iterable
    {
        return [${taskClassName}::class];
    }

    public function run(): void
    {
        // Your task logic here
    }
}
`;
}
