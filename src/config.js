export default {
  maxLogEntries: 300,

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
