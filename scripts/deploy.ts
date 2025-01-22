import { ethers } from "hardhat";

async function main() {
  console.log("开始部署合约...");

  // 部署 MockERC20
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy(
    "Mock Token",
    "MTK",
    ethers.parseEther("1000000") // 初始供应量 1,000,000
  );
  await mockToken.waitForDeployment();
  console.log("MockERC20 已部署到:", await mockToken.getAddress());

  // 部署 MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy(
    ethers.parseUnits("1000000", 6) // USDC 使用 6 位小数
  );
  await mockUSDC.waitForDeployment();
  console.log("MockUSDC 已部署到:", await mockUSDC.getAddress());

  // 部署 UniswapV2Pair
  const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
  const uniswapV2Pair = await UniswapV2Pair.deploy(
    await mockToken.getAddress(),
    await mockUSDC.getAddress()
  );
  await uniswapV2Pair.waitForDeployment();
  console.log("UniswapV2Pair 已部署到:", await uniswapV2Pair.getAddress());

  // 打印部署信息
  console.log("\n部署信息汇总:");
  console.log("--------------------");
  console.log("MockToken 地址:", await mockToken.getAddress());
  console.log("MockUSDC 地址:", await mockUSDC.getAddress());
  console.log("UniswapV2Pair 地址:", await uniswapV2Pair.getAddress());
}

// 运行部署脚本
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 