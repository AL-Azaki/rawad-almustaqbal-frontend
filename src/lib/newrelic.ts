import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'

// Remaining import statements
const options = {
  "info": {
    "applicationID": Number(import.meta.env.VITE_NR_APPLICATION_ID || '601660300'),
    "beacon": import.meta.env.VITE_NR_BEACON || "bam.nr-data.net",
    "errorBeacon": import.meta.env.VITE_NR_ERROR_BEACON || "bam.nr-data.net",
    "licenseKey": import.meta.env.VITE_NR_LICENSE_KEY || "NRJS-8509b80cc19f8efdefe",
    "sa": 1
  },
  "init": {
    "ajax": {
      "deny_list": ["bam.nr-data.net"]
    },
    "browser_consent_mode": {
      "enabled": false
    },
    "distributed_tracing": {
      "enabled": true
    },
    "performance": {
      "capture_detail": false,
      "capture_marks": false,
      "capture_measures": true
    },
    "privacy": {
      "cookies_enabled": true
    }
  },
  "loader_config": {
    "accountID": Number(import.meta.env.VITE_NR_ACCOUNT_ID || '8290554'),
    "agentID": Number(import.meta.env.VITE_NR_AGENT_ID || '601660300'),
    "applicationID": Number(import.meta.env.VITE_NR_APPLICATION_ID || '601660300'),
    "licenseKey": import.meta.env.VITE_NR_LICENSE_KEY || "NRJS-8509b80cc19f8efdefe",
    "trustKey": Number(import.meta.env.VITE_NR_TRUST_KEY || '8290554')
  }
} as any

// The agent loader code executes immediately on instantiation.
export const nrba = new BrowserAgent(options)
// Remaining code