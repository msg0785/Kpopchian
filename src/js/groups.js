groups = {
  init: function() {
    $.getJSON('./data/members.json?v=12', function (members) {
      let columns = '';
      const makeColumn = (member) => {
        const column = `
          <div class="column is-one-quarter">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img src="${member.mainImgUrl}" alt="Placeholder image">
                </figure>
              </div>
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img src="${member.subImgUrl}" alt="Placeholder image">
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">${member.name}</p>
                    <p class="subtitle is-6" id="human-${member.memberId}"></p>
                  </div>
                </div>
                <div class="content">
                  ${member.intro}
                </div>
                <div class="content">
                  <a onclick="adopt(${member.memberId}, '${member.name}', '${member.subImgUrl}')" class="button is-link is-fullwidth">최애멤버선택하기</a>
                </div>
              </div>
            </div>
          </div>`
        return column;
      }

      const groupsId = parseInt(getParameterByName('groupsId'), 10);
      let memberCount = 0;
      $.each(members, function(index, member) {
        if (groupsId && groupsId === member.groupsId) {
          columns += makeColumn(member);
          memberCount ++;
        }
      });

      $('.subtitle').text(`멤버${memberCount}중에 최애멤버를 선택하고 후원해보세요`)
      $('.columns').html(columns);

      // STEP 2 Remove this anotation
      for(let i = 0; i < members.length; i ++) {
        $.ajax({
          url: Const.luniverse.endpoint.transactionAction(Config.txActionName.getOwner),
          type: 'post',
          crossDomain: true,
          dataType: 'json',
          headers: {
            'Authorization': `Bearer ${Config.dapp.apiKey}`,
          },
          data: {
            'from': Config.walletAddress.user,
            'inputs': {
              '_index': members[i].memberId
            }
          },
          success: function (data) {
            if (data.data.res[0] !== '') {
              $(`#human-${members[i].memberId}`).text(`후원인: ${data.data.res[0]}`)
            }
          },
          error: function (data) {
          }
        })
      }
    });
  }
};

$(function() {
  groups.init();
});

// actionName === Support
function support(value) {
  $('.overlay').show()
  $.ajax({
    url: Const.luniverse.endpoint.transactionAction(Config.txActionName.support),
    type: 'post',
    crossDomain: true,
    dataType: 'json',
    headers: {
      'api-key': Config.dapp.apiKey,
    },
    data: {
      'from': Config.walletAddress.user,
      'inputs' : {
        'receiverAddress': Config.walletAddress.pd,
        'valueAmount': (new BigNumber(value)).times((new BigNumber(10)).pow(18)).toFixed(),
      },
    },
    // actionName === Reward
    success: function (data) {
      if ( data.data != undefined && data.data.rawTx != undefined ) {
        if (typeof ethereum !== 'undefined') {
          ethereum.enable().catch(console.error)
          const from = web3.eth.accounts[0];

          rawTx = data.data.rawTx;
          console.log('sendTransaction to metamask', rawTx);

          web3.eth.sendTransaction(rawTx, function (err, result) {
            if (err) return console.error(err);
            console.log('SIGNED:' + result);
            reward(value);
          });
        }
      }
      else {
        reward(value);
      }
    },
    error: function (data) {
      alert('후원에 실패했습니다.')
      $('.overlay').hide()
    }
  });
}

function reward(value) {
      $.ajax({
        url: Const.luniverse.endpoint.transactionAction(Config.txActionName.reward),
        type: 'post',
        crossDomain: true,
        dataType: 'json',
        headers: {
          'api-key': Config.dapp.apiKey,
        },
        data: {
          'from': Config.walletAddress.pd,
          'inputs' : {
            'receiverAddress': Config.walletAddress.user,
            'valueAmount': (new BigNumber(value)).times(10).times((new BigNumber(10)).pow(18)).toFixed(),
          }
        },
        success: function (data) {
          alert(`후원에 성공하여 ${value * 10} ADT를 획득했습니다.`)
          $('.overlay').hide()
        },
        error: function (data) {
          alert('후원에 실패했습니다.')
          $('.overlay').hide()
        }
      });
}

// 'actionName': 'Adopt'
function adopt(memberId, memberName, imgUrl) {
  $('.overlay').show()
  $.ajax({
    url: Const.luniverse.endpoint.transactionAction(Config.txActionName.adopt),
    type: 'post',
    crossDomain: true,
    dataType: 'json',
    headers: {
      'api-key': Config.dapp.apiKey,
    },
    data: {
      'from': Config.walletAddress.user,
      'inputs' : {
        'receiverAddress': Config.walletAddress.pd,
        'valueAmount': (new BigNumber(100)).times((new BigNumber(10)).pow(18)).toFixed(),
      }
    },
    success: function (data) {
      // STEP 2 Remove this anotation
      if ( data.data != undefined && data.data.rawTx != undefined ) {
        if (typeof ethereum !== 'undefined') {
          ethereum.enable().catch(console.error)
          const from = web3.eth.accounts[0];

          rawTx = data.data.rawTx;
          console.log('sendTransaction to metamask', rawTx);

          web3.eth.sendTransaction(rawTx, function (err, result) {
            if (err) return console.error(err);
            console.log('SIGNED:' + result);
            adopthuman(memberId);
          });
        }
      }
      else {
        adopthuman(memberId);
      }

     // STEP 2 remove below 2 line
    },
    error: function (data) {
      alert('최애픽에 실패하였습니다.')
      $('.overlay').hide()
    }
  });
}

function adopthuman(memberId) {
      $.ajax({
        url: Const.luniverse.endpoint.transactionAction(Config.txActionName.setOwner),
        type: 'post',
        crossDomain: true,
        dataType: 'json',
        headers: {
          'Authorization': `Bearer ${Config.dapp.apiKey}`,
        },
        data: {
          'from': Config.walletAddress.user,
          'inputs': {
            '_index': memberId,
            '_name': Config.userName
          }
        },
        success: function (data) {
          alert('최애픽에 성공하였습니다.')
          $('.overlay').hide()
        },
        error: function (data) {
          alert('최애픽에 실패하였습니다.')
          $('.overlay').hide()
        }
      })
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
