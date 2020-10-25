const querier = require('../modules/querier');

const srv1 = new querier('srv1.zaginiony-swiat.pl', 27017, 32332, 'Azorek530');
const srv2 = new querier('srv1.zaginiony-swiat.pl', 27018, 32333, 'Azorek530');
const srv3 = new querier('srv1.zaginiony-swiat.pl', 27019, 32334, 'Azorek530');
const srv4 = new querier('srv1.zaginiony-swiat.pl', 27030, 32000, 'Azorek530');
const srv5 = new querier('srv1.zaginiony-swiat.pl', 27031, 32001, 'Azorek530');
const srv6 = new querier('srv1.zaginiony-swiat.pl', 27032, 32002, 'Azorek530');
const srv7 = new querier('srv1.zaginiony-swiat.pl', 27033, 32003, 'Azorek530');

module.exports = {
  async get_status(id) {
    const servers_id = id;
    const status = [];

    switch(servers_id) {
      case '1':
        status.push( await srv1.showInfo() );
        status.push( await srv2.showInfo() );
        status.push( await srv3.showInfo() );

        return { success: true, response: status };
      case '2':
        status.push( await srv4.showInfo() );
        status.push( await srv5.showInfo() );
        status.push( await srv6.showInfo() );
        status.push( await srv7.showInfo() );

        return { success: true, response: status };
      default:
        return { success: false, error: 'No servers selected' };
    }
  },
  async get_shop_items() {
    return { success:true,
      response: [
        {
          img: 'vip',
          title: 'VIP',
          description: 'Ranga VIP na serwerach',
          price: 19,
          product: 1
        },
        {
          img: 'svip',
          title: 'Super VIP',
          description: 'Ranga Super VIP na serwerach',
          price: 39,
          product: 2
        },
        {
          img: 'donator',
          title: 'Donator',
          description: 'Ranga Donator na serwerach',
          price: 99,
          product: 3
        },
        {
          img: 'pngkey.com-gold-coins-falling-png-1079697',
          title: '200 pkt',
          description: 'Kilka punktów na urozmaicenie gry',
          price: 10,
          product: 4
        },
        {
          img: 'pngkey.com-pile-of-gold-png-1598541',
          title: '500 pkt',
          description: 'Trochę więcej punktów, chcę pokazać somsiadowi, że mnie stać',
          price: 29,
          product: 5
        },
        {
          img: 'pngkey.com-bag-of-gold-png-4103253',
          title: '1000 pkt',
          description: 'Ogromny wór punktów, bo mnie stać',
          price: 49,
          product: 6
        }
      ]
    };
  }
}