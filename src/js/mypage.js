MyPage = {
  init: function() {
    $.ajax({
      url: Const.luniverse.endpoint.balanceOf(Config.walletAddress.user, Config.mt.symbol, Config.st.support.symbol),
      type: 'get',
      crossDomain: true,
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${Config.dapp.apiKey}`,
      },
      success: function (data) {
        let sptBalance = data.data.balance || '';
        $('#KPC').text((new BigNumber(sptBalance)).div((new BigNumber('10')).pow(18)).toFixed(5));
      },
      error: function (data) {
      }
    });

    $.ajax({
      url: Const.luniverse.endpoint.balanceOf(Config.walletAddress.user, Config.mt.symbol, Config.st.adopt.symbol),
      type: 'get',
      crossDomain: true,
      dataType: 'json',
      headers: {
        'Authorization': `Bearer ${Config.dapp.apiKey}`,
      },
      success: function (data) {
        let adtBalance = data.data.balance || '';
        $('#KPP').text((new BigNumber(adtBalance)).div((new BigNumber('10')).pow(18)).toFixed(5));
      },
      error: function (data) {
      }
    });
  },
};

$(function() {
  MyPage.init();
});
