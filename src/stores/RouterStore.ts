import { createBrowserHistory } from 'history';
import { generatePath } from 'react-router';
import qs from 'qs';
import { RouterStore, syncHistoryWithStore } from '@ibm/mobx-react-router';

export default class CustomRouterStore {
  protected store = new RouterStore()

  constructor() {
    const browserHistory = createBrowserHistory();

    this.store.history = syncHistoryWithStore(browserHistory, this.store);

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        const value = target.store[prop]
        return typeof value === "function" ? value.bind(target.store) : value;
      },
    });
  }

  generatePath(
    route: string,
    params: Record<string, string | number> = {},
    queryParams: Record<string, unknown> = {},
  ) {
    const path = generatePath(route, params);
    const query = qs.stringify(queryParams);
    if (query) {
      return `${path}?${query}`;
    }

    return path;
  }

  goTo(
    path: string,
    params: Record<string, string | number> = {},
    queryParams: Record<string, unknown> = {},
  ) {
    const url = this.generatePath(path, params, queryParams);
    this.store.push(url);
  }

  goToModal(modalId: string, params?: Record<string, unknown>) {
    const qp = { modal: { id: modalId, ...params } };
    const query = qs.stringify(qp);
    this.store.push(`${this.store.location.pathname}?${query}`);
  }

  closeModal(replace: boolean = true) {
    if (replace) {
      this.store.replace(this.store.location.pathname);
      return;
    }

    const { modal, ...rest } = qs.parse(this.store.location.search);
    const queryString = qs.stringify(rest);

    const location = `${this.store.location.pathname}?${queryString}`;
    if (replace) {
      this.store.replace(location);
    }
    this.store.push(location);
  }
}
