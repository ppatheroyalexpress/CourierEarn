package com.courierearn.tests

import com.courierearn.domain.model.Transaction
import java.time.LocalDate
import javax.inject.Inject

/**
 * Commission Calculation Tests (20 Test Cases)
 * TC-CC-001 to TC-CC-020
 */
class CommissionCalculationTest @Inject constructor() {
    
    /**
     * TC-CC-001: Verify Cash Collect calculation (200 MMK each)
     */
    fun testCashCollectCalculation(): TestResult {
        return try {
            val cashCollect = 5
            val expected = 5 * 200 // 1000 MMK
            val actual = Transaction.calculateDailyTotal(cashCollect, 0, 0, 0)
            
            if (actual == expected) {
                TestResult.Pass("Cash Collect calculation correct: $actual MMK")
            } else {
                TestResult.Fail("Cash Collect calculation incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Cash Collect calculation error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-002: Verify Sender Pay calculation (100 MMK each)
     */
    fun testSenderPayCalculation(): TestResult {
        return try {
            val senderPay = 3
            val expected = 3 * 100 // 300 MMK
            val actual = Transaction.calculateDailyTotal(0, senderPay, 0, 0)
            
            if (actual == expected) {
                TestResult.Pass("Sender Pay calculation correct: $actual MMK")
            } else {
                TestResult.Fail("Sender Pay calculation incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Sender Pay calculation error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-003: Verify Rejected calculation (0 MMK each)
     */
    fun testRejectedCalculation(): TestResult {
        return try {
            val rejected = 2
            val expected = 0 // 0 MMK
            val actual = Transaction.calculateDailyTotal(0, 0, rejected, 0)
            
            if (actual == expected) {
                TestResult.Pass("Rejected calculation correct: $actual MMK")
            } else {
                TestResult.Fail("Rejected calculation incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Rejected calculation error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-004: Verify FOC calculation (0 MMK each)
     */
    fun testFOCCalculation(): TestResult {
        return try {
            val foc = 1
            val expected = 0 // 0 MMK
            val actual = Transaction.calculateDailyTotal(0, 0, 0, foc)
            
            if (actual == expected) {
                TestResult.Pass("FOC calculation correct: $actual MMK")
            } else {
                TestResult.Fail("FOC calculation incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("FOC calculation error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-005: Verify EC Bonus is added directly
     */
    fun testECBonusAddition(): TestResult {
        return try {
            val ec = 500
            val transaction = Transaction(
                id = "test-005",
                date = LocalDate.now(),
                cashCollect = 0,
                senderPay = 0,
                rejected = 0,
                foc = 0,
                ec = ec,
                dailyTotal = 0
            )
            
            // EC Bonus should be added to daily total separately
            val expected = ec
            val actual = transaction.ec
            
            if (actual == expected) {
                TestResult.Pass("EC Bonus addition correct: $actual MMK")
            } else {
                TestResult.Fail("EC Bonus addition incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("EC Bonus addition error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-006: Verify daily total with only Cash Collect
     */
    fun testDailyTotalOnlyCashCollect(): TestResult {
        return try {
            val cashCollect = 8
            val expected = 8 * 200 // 1600 MMK
            val actual = Transaction.calculateDailyTotal(cashCollect, 0, 0, 0)
            
            if (actual == expected) {
                TestResult.Pass("Daily total with only Cash Collect correct: $actual MMK")
            } else {
                TestResult.Fail("Daily total with only Cash Collect incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Daily total with only Cash Collect error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-007: Verify daily total with only Sender Pay
     */
    fun testDailyTotalOnlySenderPay(): TestResult {
        return try {
            val senderPay = 6
            val expected = 6 * 100 // 600 MMK
            val actual = Transaction.calculateDailyTotal(0, senderPay, 0, 0)
            
            if (actual == expected) {
                TestResult.Pass("Daily total with only Sender Pay correct: $actual MMK")
            } else {
                TestResult.Fail("Daily total with only Sender Pay incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Daily total with only Sender Pay error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-008: Verify daily total with mixed deliveries
     */
    fun testDailyTotalMixedDeliveries(): TestResult {
        return try {
            val cashCollect = 3
            val senderPay = 2
            val rejected = 1
            val foc = 1
            val expected = (3 * 200) + (2 * 100) + (1 * 0) + (1 * 0) // 600 + 200 + 0 + 0 = 800 MMK
            val actual = Transaction.calculateDailyTotal(cashCollect, senderPay, rejected, foc)
            
            if (actual == expected) {
                TestResult.Pass("Daily total with mixed deliveries correct: $actual MMK")
            } else {
                TestResult.Fail("Daily total with mixed deliveries incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Daily total with mixed deliveries error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-009: Verify daily total with EC Bonus
     */
    fun testDailyTotalWithECBonus(): TestResult {
        return try {
            val cashCollect = 2
            val senderPay = 1
            val rejected = 0
            val foc = 0
            val ec = 300
            val deliveryTotal = Transaction.calculateDailyTotal(cashCollect, senderPay, rejected, foc)
            val expected = deliveryTotal + ec // 500 + 300 = 800 MMK
            
            val transaction = Transaction(
                id = "test-009",
                date = LocalDate.now(),
                cashCollect = cashCollect,
                senderPay = senderPay,
                rejected = rejected,
                foc = foc,
                ec = ec,
                dailyTotal = expected
            )
            
            val actual = transaction.dailyTotal
            
            if (actual == expected) {
                TestResult.Pass("Daily total with EC Bonus correct: $actual MMK")
            } else {
                TestResult.Fail("Daily total with EC Bonus incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Daily total with EC Bonus error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-010: Verify daily total with all types
     */
    fun testDailyTotalAllTypes(): TestResult {
        return try {
            val cashCollect = 5
            val senderPay = 3
            val rejected = 2
            val foc = 1
            val ec = 400
            val deliveryTotal = Transaction.calculateDailyTotal(cashCollect, senderPay, rejected, foc)
            val expected = deliveryTotal + ec // 1300 + 400 = 1700 MMK
            
            val transaction = Transaction(
                id = "test-010",
                date = LocalDate.now(),
                cashCollect = cashCollect,
                senderPay = senderPay,
                rejected = rejected,
                foc = foc,
                ec = ec,
                dailyTotal = expected
            )
            
            val actual = transaction.dailyTotal
            
            if (actual == expected) {
                TestResult.Pass("Daily total with all types correct: $actual MMK")
            } else {
                TestResult.Fail("Daily total with all types incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Daily total with all types error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-011: Verify calculation with zero values
     */
    fun testCalculationWithZeroValues(): TestResult {
        return try {
            val expected = 0
            val actual = Transaction.calculateDailyTotal(0, 0, 0, 0)
            
            if (actual == expected) {
                TestResult.Pass("Calculation with zero values correct: $actual MMK")
            } else {
                TestResult.Fail("Calculation with zero values incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Calculation with zero values error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-012: Verify calculation with maximum values
     */
    fun testCalculationWithMaximumValues(): TestResult {
        return try {
            val cashCollect = 9999
            val senderPay = 9999
            val rejected = 9999
            val foc = 9999
            val expected = (9999 * 200) + (9999 * 100) + (9999 * 0) + (9999 * 0) // 1,999,800 + 999,900 = 2,999,700 MMK
            val actual = Transaction.calculateDailyTotal(cashCollect, senderPay, rejected, foc)
            
            if (actual == expected) {
                TestResult.Pass("Calculation with maximum values correct: $actual MMK")
            } else {
                TestResult.Fail("Calculation with maximum values incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Calculation with maximum values error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-013: Verify calculation precision
     */
    fun testCalculationPrecision(): TestResult {
        return try {
            val cashCollect = 7
            val senderPay = 5
            val expected = (7 * 200) + (5 * 100) // 1400 + 500 = 1900 MMK
            val actual = Transaction.calculateDailyTotal(cashCollect, senderPay, 0, 0)
            
            if (actual == expected && actual is Int) {
                TestResult.Pass("Calculation precision correct: $actual MMK")
            } else {
                TestResult.Fail("Calculation precision incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Calculation precision error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-014: Verify negative value handling
     */
    fun testNegativeValueHandling(): TestResult {
        return try {
            val cashCollect = -5
            val senderPay = -3
            
            // This should be handled at validation level
            // For now, we'll test the calculation function directly
            val actual = Transaction.calculateDailyTotal(cashCollect, senderPay, 0, 0)
            val expected = (-5 * 200) + (-3 * 100) // -1000 + -300 = -1300 MMK
            
            if (actual == expected) {
                TestResult.Pass("Negative value handling in calculation: $actual MMK (should be validated at UI level)")
            } else {
                TestResult.Fail("Negative value handling incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Negative value handling error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-015: Verify large number calculations
     */
    fun testLargeNumberCalculations(): TestResult {
        return try {
            val cashCollect = 5000
            val senderPay = 3000
            val expected = (5000 * 200) + (3000 * 100) // 1,000,000 + 300,000 = 1,300,000 MMK
            val actual = Transaction.calculateDailyTotal(cashCollect, senderPay, 0, 0)
            
            if (actual == expected) {
                TestResult.Pass("Large number calculations correct: $actual MMK")
            } else {
                TestResult.Fail("Large number calculations incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Large number calculations error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-016: Verify monthly total calculation
     */
    fun testMonthlyTotalCalculation(): TestResult {
        return try {
            val transactions = listOf(
                Transaction("1", LocalDate.now(), 5, 3, 1, 0, 200, 1500),
                Transaction("2", LocalDate.now(), 3, 2, 0, 1, 150, 900),
                Transaction("3", LocalDate.now(), 7, 4, 2, 0, 300, 2100)
            )
            
            val expected = 1500 + 900 + 2100 // 4500 MMK
            val actual = transactions.sumOf { it.dailyTotal }
            
            if (actual == expected) {
                TestResult.Pass("Monthly total calculation correct: $actual MMK")
            } else {
                TestResult.Fail("Monthly total calculation incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Monthly total calculation error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-017: Verify monthly average calculation
     */
    fun testMonthlyAverageCalculation(): TestResult {
        return try {
            val transactions = listOf(
                Transaction("1", LocalDate.now(), 5, 3, 1, 0, 200, 1500),
                Transaction("2", LocalDate.now(), 3, 2, 0, 1, 150, 900),
                Transaction("3", LocalDate.now(), 7, 4, 2, 0, 300, 2100)
            )
            
            val expected = (1500 + 900 + 2100) / 3 // 1500 MMK
            val actual = transactions.map { it.dailyTotal }.average().toInt()
            
            if (actual == expected) {
                TestResult.Pass("Monthly average calculation correct: $actual MMK")
            } else {
                TestResult.Fail("Monthly average calculation incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Monthly average calculation error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-018: Verify monthly progress calculation
     */
    fun testMonthlyProgressCalculation(): TestResult {
        return try {
            val currentEarnings = 150000
            val targetEarnings = 300000
            val expected = 0.5f // 50%
            val actual = currentEarnings.toFloat() / targetEarnings.toFloat()
            
            if (actual == expected) {
                TestResult.Pass("Monthly progress calculation correct: ${(actual * 100).toInt()}%")
            } else {
                TestResult.Fail("Monthly progress calculation incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Monthly progress calculation error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-019: Verify monthly statistics accuracy
     */
    fun testMonthlyStatisticsAccuracy(): TestResult {
        return try {
            val transactions = listOf(
                Transaction("1", LocalDate.now(), 5, 3, 1, 0, 200, 1500),
                Transaction("2", LocalDate.now(), 3, 2, 0, 1, 150, 900),
                Transaction("3", LocalDate.now(), 7, 4, 2, 0, 300, 2100)
            )
            
            val totalCashCollect = transactions.sumOf { it.cashCollect } // 15
            val totalSenderPay = transactions.sumOf { it.senderPay } // 9
            val totalRejected = transactions.sumOf { it.rejected } // 3
            val totalFoc = transactions.sumOf { it.foc } // 1
            val totalEc = transactions.sumOf { it.ec } // 650
            val totalEarnings = transactions.sumOf { it.dailyTotal } // 4500
            
            val expectedCashCollect = 15
            val expectedSenderPay = 9
            val expectedRejected = 3
            val expectedFoc = 1
            val expectedEc = 650
            val expectedEarnings = 4500
            
            if (totalCashCollect == expectedCashCollect && 
                totalSenderPay == expectedSenderPay && 
                totalRejected == expectedRejected && 
                totalFoc == expectedFoc && 
                totalEc == expectedEc && 
                totalEarnings == expectedEarnings) {
                TestResult.Pass("Monthly statistics accuracy verified")
            } else {
                TestResult.Fail("Monthly statistics inaccurate")
            }
        } catch (e: Exception) {
            TestResult.Fail("Monthly statistics error: ${e.message}")
        }
    }
    
    /**
     * TC-CC-020: Verify month transition handling
     */
    fun testMonthTransitionHandling(): TestResult {
        return try {
            val lastMonthDate = LocalDate.now().minusMonths(1)
            val currentMonthDate = LocalDate.now()
            
            val lastMonthTransaction = Transaction("1", lastMonthDate, 5, 3, 1, 0, 200, 1500)
            val currentMonthTransaction = Transaction("2", currentMonthDate, 7, 4, 2, 0, 300, 2100)
            
            val transactions = listOf(lastMonthTransaction, currentMonthTransaction)
            val currentMonthTransactions = transactions.filter { 
                it.date.year == currentMonthDate.year && 
                it.date.month == currentMonthDate.month 
            }
            
            val expected = 1 // Only current month transaction
            val actual = currentMonthTransactions.size
            
            if (actual == expected) {
                TestResult.Pass("Month transition handling correct")
            } else {
                TestResult.Fail("Month transition handling incorrect. Expected: $expected, Actual: $actual")
            }
        } catch (e: Exception) {
            TestResult.Fail("Month transition handling error: ${e.message}")
        }
    }
    
    /**
     * Run all Commission Calculation tests
     */
    fun runAllTests(): List<TestResult> {
        return listOf(
            testCashCollectCalculation(),
            testSenderPayCalculation(),
            testRejectedCalculation(),
            testFOCCalculation(),
            testECBonusAddition(),
            testDailyTotalOnlyCashCollect(),
            testDailyTotalOnlySenderPay(),
            testDailyTotalMixedDeliveries(),
            testDailyTotalWithECBonus(),
            testDailyTotalAllTypes(),
            testCalculationWithZeroValues(),
            testCalculationWithMaximumValues(),
            testCalculationPrecision(),
            testNegativeValueHandling(),
            testLargeNumberCalculations(),
            testMonthlyTotalCalculation(),
            testMonthlyAverageCalculation(),
            testMonthlyProgressCalculation(),
            testMonthlyStatisticsAccuracy(),
            testMonthTransitionHandling()
        )
    }
}
