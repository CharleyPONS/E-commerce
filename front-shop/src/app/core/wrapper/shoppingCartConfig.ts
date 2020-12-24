export class IShoppingCartConfig {
  itemType: any;
  serviceType: 'localStorage';
  serviceOptions: {
    storageKey: 'cbd-cart';
    clearOnError: true;
  };
}
