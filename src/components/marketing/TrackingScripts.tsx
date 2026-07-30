import { useSettings } from '../../contexts/SettingsContext';
import { Helmet } from 'react-helmet-async';

// Strict Validation Regexes
const VALIDATORS = {
  ga: /^G-[A-Z0-9]+$/,
  gtm: /^GTM-[A-Z0-9]+$/,
  meta: /^\d{15,16}$/,
  tiktok: /^[A-Z0-9]{15,30}$/i,
  snapchat: /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i,
  searchConsole: /^.+$/
};

const sanitizeId = (id: string | undefined, regex: RegExp): string | null => {
  if (!id) return null;
  const clean = id.trim();
  // Prevent multiline/unicode bypasses
  if (clean.includes('\n') || clean.includes('\r') || clean.includes('<') || clean.includes('>')) return null;
  return regex.test(clean) ? clean : null;
};

export default function TrackingScripts() {
  const { settings } = useSettings();

  if (!settings) return null;

  const gaId = sanitizeId(settings.googleAnalyticsId, VALIDATORS.ga);
  const gtmId = sanitizeId(settings.gtmId, VALIDATORS.gtm);
  const metaId = sanitizeId(settings.metaPixelId, VALIDATORS.meta);
  const tiktokId = sanitizeId(settings.tiktokPixelId, VALIDATORS.tiktok);
  const snapchatId = sanitizeId(settings.snapchatPixelId, VALIDATORS.snapchat);
  const scId = sanitizeId(settings.googleSearchConsoleId, VALIDATORS.searchConsole);

  return (
    <Helmet>
      {/* Google Analytics */}
      {settings.googleAnalyticsEnabled === '1' && gaId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
      )}
      {settings.googleAnalyticsEnabled === '1' && gaId && (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(gaId)});
          `}
        </script>
      )}

      {/* Google Tag Manager */}
      {settings.gtmEnabled === '1' && gtmId && (
        <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
          `}
        </script>
      )}

      {/* Meta Pixel */}
      {settings.metaPixelEnabled === '1' && metaId && (
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${JSON.stringify(metaId)});
            fbq('track', 'PageView');
          `}
        </script>
      )}

      {/* TikTok Pixel */}
      {settings.tiktokPixelEnabled === '1' && tiktokId && (
        <script>
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load(${JSON.stringify(tiktokId)});
              ttq.page();
            }(window, document, 'ttq');
          `}
        </script>
      )}

      {/* Snapchat Pixel */}
      {settings.snapchatPixelEnabled === '1' && snapchatId && (
        <script>
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            snaptr('init', ${JSON.stringify(snapchatId)});
            snaptr('track', 'PAGE_VIEW');
          `}
        </script>
      )}

      {/* Google Search Console (Verification) */}
      {settings.googleSearchConsoleEnabled === '1' && scId && (
        <meta name="google-site-verification" content={scId} />
      )}
    </Helmet>
  );
}

