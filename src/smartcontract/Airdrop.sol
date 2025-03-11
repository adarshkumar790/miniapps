// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Airdrop is Ownable {
    IERC20 public token;
    bytes32 public merkleRoot;
    uint256 public claimFee = 1000000000000000000; 

    struct ClaimInfo {
        address user;
        uint256 amount;
        bool claimed;
    }

    mapping(string => ClaimInfo) public claims;

    event TokensClaimed(
        address indexed user,
        string indexed telegramId,
        uint256 amount
    );

    constructor(
        address _token,
        bytes32 _merkleRoot
    ) Ownable(msg.sender) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }


    function claimTokens(
        string memory telegramId,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external payable {
        require(
            !claims[telegramId].claimed,
            "Tokens already claimed for this Telegram ID"
        );
        require(msg.value >= claimFee, "ETH required to claim tokens");
        bytes32 leaf = keccak256(abi.encodePacked(telegramId, amount));
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid proof"
        );
        claims[telegramId] = ClaimInfo(msg.sender, amount, true);
        // (bool success, ) = payable(owner()).call{value: msg.value}("");
        // require(success, "ETH transfer failed");
        require(token.transfer(msg.sender, amount), "Token transfer failed");
        emit TokensClaimed(msg.sender, telegramId, amount);
    }

    function claimStatus(string memory telegramId) external view returns (bool){
        return claims[telegramId].claimed;
    }

    function verifyView(
        string memory telegramId,
        uint256 tokens,
        bytes32[] calldata proof
    ) external  view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(telegramId, tokens));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    function getClaimInfo(string memory telegramId)
        external
        view
        returns (
            address,
            uint256,
            bool
        )
    {
        ClaimInfo memory claim = claims[telegramId];
        return (claim.user, claim.amount, claim.claimed);
    }

    function updateMerkleRoot(bytes32 _merkleRoot) private onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function updateFee(uint256 newFee) private  onlyOwner {
        require(newFee > 0, "Fee must be greater than zero");
        claimFee = newFee;
    }

    function withdrawNative() private  onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "ETH transfer failed");
    }

    function withdrawERC20(address _token) private  onlyOwner {
        IERC20 erc20 = IERC20(_token);
        uint256 balance = erc20.balanceOf(address(this));
        require(balance > 0, "No ERC20 tokens to withdraw");

        require(erc20.transfer(owner(), balance), "ERC20 transfer failed");
    }
}