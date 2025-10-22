export function getVueModuleIndexTemplate(moduleName: string): string {
    return `import './page/${moduleName}-list';
import './page/${moduleName}-detail';

Shopware.Module.register('${moduleName}', {
    type: 'plugin',
    name: '${moduleName}',
    title: '${moduleName}.general.mainMenuItemGeneral',
    description: '${moduleName}.general.descriptionTextModule',
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',

    routes: {
        list: {
            component: '${moduleName}-list',
            path: 'list'
        },
        detail: {
            component: '${moduleName}-detail',
            path: 'detail/:id',
            meta: {
                parentPath: '${moduleName}.list'
            }
        }
    },

    navigation: [{
        label: '${moduleName}.general.mainMenuItemGeneral',
        color: '#ff3d58',
        path: '${moduleName}.list',
        icon: 'default-shopping-paper-bag-product',
        position: 100
    }]
});
`;
}

export function getVueModuleListPageTemplate(moduleName: string): string {
    return `import template from './${moduleName}-list.html.twig';

const { Component } = Shopware;

Component.register('${moduleName}-list', {
    template,

    inject: ['repositoryFactory'],

    data() {
        return {
            repository: null,
            items: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    computed: {
        columns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                label: this.$t('${moduleName}.list.columnName'),
                routerLink: '${moduleName}.detail',
                inlineEdit: 'string',
                allowResize: true,
                primary: true
            }];
        }
    },

    created() {
        this.repository = this.repositoryFactory.create('your_entity');
        this.getList();
    },

    methods: {
        getList() {
            this.repository
                .search(new Shopware.Data.Criteria(), Shopware.Context.api)
                .then((result) => {
                    this.items = result;
                });
        }
    }
});
`;
}

export function getVueModuleListPageTwigTemplate(moduleName: string): string {
    return `{% block ${moduleName}_list %}
    <sw-page class="${moduleName}-list">
        {% block ${moduleName}_list_content %}
            <sw-card-view>
                <sw-card>
                    <sw-data-grid
                        :dataSource="items"
                        :columns="columns"
                        :showSelection="false">
                    </sw-data-grid>
                </sw-card>
            </sw-card-view>
        {% endblock %}
    </sw-page>
{% endblock %}
`;
}

export function getVueModuleDetailPageTemplate(moduleName: string): string {
    return `import template from './${moduleName}-detail.html.twig';

const { Component } = Shopware;

Component.register('${moduleName}-detail', {
    template,

    inject: ['repositoryFactory'],

    data() {
        return {
            repository: null,
            item: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    created() {
        this.repository = this.repositoryFactory.create('your_entity');
        this.getItem();
    },

    methods: {
        getItem() {
            this.repository
                .get(this.$route.params.id, Shopware.Context.api)
                .then((entity) => {
                    this.item = entity;
                });
        },

        saveItem() {
            this.repository
                .save(this.item, Shopware.Context.api)
                .then(() => {
                    this.$router.push({ name: '${moduleName}.list' });
                });
        }
    }
});
`;
}

export function getVueModuleDetailPageTwigTemplate(moduleName: string): string {
    return `{% block ${moduleName}_detail %}
    <sw-page class="${moduleName}-detail">
        {% block ${moduleName}_detail_content %}
            <sw-card-view>
                <sw-card title="Details">
                    <!-- Add your form fields here -->
                </sw-card>
            </sw-card-view>
        {% endblock %}

        {% block ${moduleName}_detail_sidebar %}
            <template #sidebar>
                <sw-sidebar-item title="Actions">
                    <sw-button @click="saveItem" variant="primary">
                        Save
                    </sw-button>
                </sw-sidebar-item>
            </template>
        {% endblock %}
    </sw-page>
{% endblock %}
`;
}
