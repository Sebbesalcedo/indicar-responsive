import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';

import { environment } from '../../../environments/environment';
// --- use a declare to allow the compiler find the ga function
declare let ga: Function;

// notes: npm install --save-dev @types/google.analytics
@Injectable()

/** */
export class GoogleAnalyticsService {

  private missingGaCount = 0;

  // tslint:disable-next-line:no-non-null-assertion
  private readonly logging = environment!.google!.analytics!.logging;
  // tslint:disable-next-line:no-non-null-assertion
  private readonly isActive: boolean = environment!.google!.analytics!.active;
  // tslint:disable-next-line:no-non-null-assertion
  private readonly UAId: string = environment!.google!.analytics!.uaId;

  private subscription: Subscription;


  constructor(private router: Router) {

  }

  /**
   * Track an event with your custom data in google analytics
   * -
   * @param {string} category Typically the object that was interacted with (e.g. 'Video')
   * @param {string} label The type of interaction (e.g. 'play')
   * @param {string} [action=null] Useful for categorizing events (e.g. 'Fall Campaign')
   * @param {number} [value=null] A numeric value associated with the event (e.g. 42)
   * @memberof GoogleAnalyticsEventService
   */
  public trackEvent(category: string, label: string, action: string = null, value: number = null) {
    try {
      if (this.isActive) {
        ga('send', 'event', { eventCategory: category, eventLabel: label,
          eventAction: action, eventValue: value
        } );
      }
    } catch (error) {
      if (this.logging && this.logging.exceptions) {
        console.error(`error: ${error}`);
      }
    }

    // testing
    if (this.logging && this.logging.debug) {
      console.log(category, label, action, value);
    }
  }


  public subscribe() {

    if (!this.subscription) {
      this.subscription = this.router.events.subscribe(e => {

        if (e instanceof NavigationEnd) {
          try {

            if (this.isActive && this.UAId.length > 0) {


              if (e.urlAfterRedirects && this.isOkToLog(e.urlAfterRedirects)) {

                // ga should be available directly via the @types/google.analytics
                // but I'm still having a problem with it, compile time seems to be good
                // but then runtime fails, using (<any>window) to access it.
                // if someone knows the reason why please let me know
                if ((<any>window).ga) {
                  (<any>window).ga('create', `${this.UAId}`, 'auto');
                  (<any>window).ga('set', 'page', e.urlAfterRedirects);
                  (<any>window).ga('send', 'pageview');
                } else {
                  // it appears that (<any>window).ga isn't available right away
                  // typically fails on the first call, so we're giving it some slack with this.missGaCount
                  // we may also want to check for headless environment (e.g. AOT or testers running w/o the window object)
                  if (this.logging && this.logging.exceptions && this.missingGaCount > 1) {
                    console.error(`can't find <any>window).ga`);
                  }

                  // mark that we've been through this
                  this.missingGaCount++;
                }

              }

               if (this.logging && this.logging.debug) {
                 console.log(`logging: ${e.urlAfterRedirects} to google analytics`);
               }

            } else {

               if (this.logging && this.logging.debug) {
                 console.log(`logging not enabled: ${e.urlAfterRedirects} to google analytics`);
               }
            }

          } catch (ex) {

             if (this.logging && this.logging.exceptions) {
               console.error(ex);
               console.error(`tracking failed - make sure you installed the scripts`);
            }
          }
        }
      });
    }
  }

  public unsubscribe() {
    if (this.subscription) {
      // --- clear our observable subscription
      this.subscription.unsubscribe();
    }
  }

  private isOkToLog(url: string): boolean {


    if (url.toString().indexOf('auth/token') !== -1) {
      if (this.logging && this.logging.verbose) {
        console.log(`don't track ${url}`);
      }
      return false;
    }

    if (this.logging && this.logging.verbose) {
      console.log(`track ${url}`);
    }

    return true;
  }

}
