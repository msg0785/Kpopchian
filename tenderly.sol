pragma solidity ^0.4.18;

contract love most tenderly {
 string [8] fandom;

 function setfandom(uint _index, string _name) public {
   fandom[_index] = _name;
 }

 function getfandom(uint _index) public view returns (string) {
   return fandom[_index];
 }
}

