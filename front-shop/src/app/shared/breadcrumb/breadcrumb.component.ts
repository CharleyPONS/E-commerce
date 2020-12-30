import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  takeUntil,
} from 'rxjs/internal/operators';
export interface IBreadCrumb {
  label: string;
  url: string;
}
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnDestroy, OnInit {
  public breadcrumbs: IBreadCrumb[];
  private _onDestroy$ = new Subject();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
  }

  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadCrumb[] = []
  ): IBreadCrumb[] {
    if (!route?.routeConfig?.data?.breadcrumb && !route?.routeConfig?.data) {
      if (route.firstChild) {
        return this.buildBreadCrumb(route.firstChild);
      }
    }
    let label =
      route.routeConfig && route.routeConfig.data
        ? route.routeConfig.data.breadcrumb
        : '';
    let isClickable =
      route.routeConfig &&
      route.routeConfig.data &&
      route.routeConfig.data.isClickable;
    let path =
      route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';
    let newBreadcrumbs = breadcrumbs;
    let breadcrumb: IBreadCrumb;
    let nextUrl: string;
    let params;
    route.params.pipe(takeUntil(this._onDestroy$)).subscribe((v) => {
      params = v;
    });
    const lastRoutePart = path.split('/');
    (lastRoutePart || []).forEach((v) => {
      const isDynamicRoute = v.startsWith(':');
      if (route?.routeConfig?.data?.firstBreadcrumb && !isDynamicRoute) {
        label = route?.routeConfig?.data?.firstBreadcrumb;
      }
      if (isDynamicRoute) {
        const paramName = v.split(':')[1];
        path = path.replace(
          v,
          route?.snapshot?.params[paramName] || params[paramName]
        );
        label = route?.snapshot?.params[paramName] || params[paramName];
      }
      nextUrl = v ? `${url}/${isDynamicRoute ? path : v}` : url;

      breadcrumb = {
        label: label,
        url: nextUrl,
      };
      if (breadcrumb.label) {
        newBreadcrumbs.push(breadcrumb);
      }
    });
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
