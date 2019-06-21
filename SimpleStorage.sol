pragma solidity ^0.4.24;

contract SimpleStorage {
    string private name;
    uint256 private value;
    
    constructor(string _name) public {
        name = _name;
    }
    
    function getName() external view returns (string) {
        return name;
    }
    
    function setValue(uint256 _value) external {
        value = _value;
    }
    
    function getValue() external view returns (uint256 _value) {
        return value;
    }
}
