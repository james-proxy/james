export default {
  maxLogEntries: 1000,

  labels: [
    {
      regex: /common-secure-static/,
      name: 'CDN',
      className: 'cdn'
    },{
      regex: /prosieben/,
      name: 'p7',
      className: 'p7'
    },
  ]
}
