export function getAdminComponentTemplate(componentName: string): string {
    return `<template>
    <div class="${componentName}">
        <!-- Component content -->
    </div>
</template>

<script>
export default {
    name: '${componentName}',
    
    props: {
        // Define props here
    },
    
    data() {
        return {
            // Component state
        };
    },
    
    computed: {
        // Computed properties
    },
    
    methods: {
        // Component methods
    },
    
    created() {
        // Component lifecycle hook
    }
};
</script>

<style lang="scss" scoped>
.${componentName} {
    // Component styles
}
</style>
`;
}

export function getAdminComponentIndexTemplate(componentName: string): string {
    return `import template from './${componentName}.html.twig';

Shopware.Component.register('${componentName}', {
    template,

    props: {
        // Define props here
    },

    data() {
        return {
            // Component state
        };
    },

    computed: {
        // Computed properties
    },

    methods: {
        // Component methods
    },

    created() {
        // Component lifecycle hook
    }
});
`;
}

export function getAdminComponentTwigTemplate(componentName: string): string {
    return `{% block ${componentName} %}
    <div class="${componentName}">
        <!-- Component content -->
    </div>
{% endblock %}
`;
}
