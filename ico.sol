pragma solidity ^0.4.11;

contract RichToken {
    address owner;
    string public constant name="K-POP Chian";
    string public constant symbol="KPC";
    uint8 public constant decimals=18;
    address public icoAddress; 
    mapping (address => uint) public balanceOf;
    event Transfer(address from, address to, uint value);
    function transfer(address _to, uint _value) {
        address _from= msg.sender;
        require(_to != address(0));                   
        require(balanceOf[_from] >= _value);  
        balanceOf[_from] -= _value;                    
        balanceOf[_to] += _value;                         
        Transfer(_from, _to, _value);
    }
    function RichToken(address _icoAddress) {
        owner=msg.sender;
        icoAddress=_icoAddress;
        ICO cs=ICO(icoAddress); 
        require(cs.getDeadline()<now);
        for(uint i=0;i<cs.getIndex();i++){
            balanceOf[cs.getInvestor(i)]=cs.getTokens(cs.getInvestor(i));
        }
    }
    function killcontract() public {if(owner==msg.sender) selfdestruct(owner);}
}

contract ICO{
    mapping (uint => address) investor;
    mapping (address=> uint) public amountInvested;
    address public owner;
    uint index;
    uint public constant exchangeRate=1000;
    uint public salesStatus;
	uint start;
    uint deadline;
    
    function getIndex() constant returns(uint){return index;}
    function getInvestor(uint i) constant returns(address){
        return investor[i];
    }
    function getDeadline() constant returns(uint){
        return deadline;
    }
	function getNow() constant returns(uint){
        return now;
    }
    function getStart() constant returns(uint){
        return start;
    }
    function getTokens(address _investor) constant returns(uint){
        return amountInvested[_investor]* exchangeRate;
    }
    function ICO(uint salesMinutes) {
        owner = msg.sender;
		start = now;
        deadline = now + salesMinutes * 1 minutes;
    }
    function invest() payable {  
        require( now < deadline );
        if(amountInvested[msg.sender] == 0 ){
            investor[index] = msg.sender;
            index++;
        }
        amountInvested[msg.sender]+=msg.value;
        salesStatus+=msg.value;
    }
    function withdraw(uint amount) {  // 판매가 끝나면 투자된 이더를 출금합니다.
        if(now > deadline && msg.sender == owner){
            msg.sender.transfer(amount);
        }
    }
}