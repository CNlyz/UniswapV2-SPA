# 开发记录

...

Q: 运行程序时，"Trade.tsx"的第77行报错了："TypeError: uniswapPair.getReservesis not a function"

A: 这个错误是因为在 UniswapV2Pair 合约的 ABI 中，没有 `getReserves` 方法，而是分别有 `reserve0` 和 `reserve1` 两个方法。

修改方案：
1. 检查了 UniswapV2Pair 合约的 ABI，发现有 `reserve0` 和 `reserve1` 两个方法
2. 修改了 `Trade.tsx` 中的代码：
   ```typescript
   // 修改前
   const [reserve0, reserve1] = await uniswapPair.getReserves();

   // 修改后
   const reserve0 = await uniswapPair.reserve0();
   const reserve1 = await uniswapPair.reserve1();
   ```

主要更改：
1. 移除了不存在的 `getReserves` 方法调用
2. 分别使用 `reserve0()` 和 `reserve1()` 方法获取储备金额
3. 这两个方法都是 `view` 类型，返回 `uint256` 类型的值 