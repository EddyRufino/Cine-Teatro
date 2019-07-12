export default {
  namespaced: true,
  state: {
    obras: [{
        oid: 'anastasia',
        titulo: 'Anastasia',
        portada: require('@/assets/obras/anastasia.jpg'),
        presentaciones: [{
          pid: 'anastasia-teatro-super-opera-2019-02-20-18-00',
          obra: {
            oid: 'anastasia',
            titulo: 'Anastasia'
          },
          teatro: {
            tid: 'teatro-super-opera',
            nombre: 'Teatro de la Súper Ópera'
          },
          fecha: '2019-02-20-18-00'
        }]
      },
      {
        oid: 'avengers',
        titulo: 'Avengers',
        portada: require('@/assets/obras/avengers.png'),
        presentaciones: [{
          pid: 'avengers-teatro-super-opera-2019-02-20-21-30',
          obra: {
            oid: 'avengers',
            titulo: 'Avengers'
          },
          teatro: {
            tid: 'teatro-super-opera',
            nombre: 'Teatro de la Súper Ópera'
          },
          fecha: '2019-02-20-21-30'
        }]
      },
      {
        oid: 'johnwick',
        titulo: 'John Wick',
        portada: require('@/assets/obras/johnwick.jpg'),
        presentaciones: [{
          pid: 'johnwick-teatro-super-opera-2019-02-20-15-30',
          obra: {
            oid: 'johnwick',
            titulo: 'John Wick'
          },
          teatro: {
            tid: 'teatro-super-opera',
            nombre: 'Teatro de la Súper Ópera'
          },
          fecha: '2019-02-20-15-30'
        }]
      },
      {
        oid: 'xmen',
        titulo: 'x-men',
        portada: require('@/assets/obras/xmen.jpg'),
        presentaciones: [{
          pid: 'xmen-teatro-super-opera-2019-02-20-12-15',
          obra: {
            oid: 'xmen',
            titulo: 'x-men'
          },
          teatro: {
            tid: 'teatro-super-opera',
            nombre: 'Teatro de la Súper Ópera'
          },
          fecha: '2019-02-20-12-15'
        }]
      }
    ]
  }
}