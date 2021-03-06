export default class ExtensionHelperService {
    constructor({ storeService, pluginService, extensionStoreDataService }) {
        this.storeService = storeService;
        this.pluginService = pluginService;
        this.extensionStoreDataService = extensionStoreDataService;
    }

    async downloadAndActivateExtension(extensionName) {
        const extensionStatus = await this.getStatusOfExtension(extensionName);

        if (!extensionStatus.downloaded) {
            await this.downloadStoreExtension(extensionName);
        }

        if (!extensionStatus.installedAt) {
            await this.installStoreExtension(extensionName);
        }

        if (!extensionStatus.active) {
            await this.activateStoreExtension(extensionName);
        }
    }

    downloadStoreExtension(extensionName) {
        return this.storeService.downloadPlugin(extensionName, true);
    }

    installStoreExtension(extensionName) {
        return this.pluginService.install(extensionName);
    }

    activateStoreExtension(extensionName) {
        return this.pluginService.activate(extensionName);
    }

    async getStatusOfExtension(extensionName) {
        const extensions = await this.extensionStoreDataService.getMyExtensions();
        const extension = extensions.find(e => e && e.name === extensionName);

        if (!extension) {
            return {
                downloaded: false,
                installedAt: false,
                active: false
            };
        }

        return {
            downloaded: true,
            installedAt: extension.installedAt,
            active: extension.active
        };
    }
}
