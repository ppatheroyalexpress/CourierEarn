package com.courierearn.printer

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothSocket
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import com.dantsu.escposprinter.EscPosPrinter
import com.dantsu.escposprinter.connection.bluetooth.BluetoothPrintersConnections
import com.dantsu.escposprinter.exceptions.EscPosBarcodeException
import com.dantsu.escposprinter.exceptions.EscPosConnectionException
import com.dantsu.escposprinter.exceptions.EscPosEncodingException
import com.dantsu.escposprinter.textparser.PrinterTextParserImg
import com.courierearn.domain.model.Transaction
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ThermalPrinterService @Inject constructor(
    @ApplicationContext private val context: Context
) {
    
    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private var currentSocket: BluetoothSocket? = null
    private var printer: EscPosPrinter? = null
    
    companion object {
        private const val PRINTER_WIDTH_CHARS = 32 // 58mm printer width
        private const val CHARSET = "UTF-8"
    }
    
    suspend fun getAvailablePrinters(): List<BluetoothDevice> = withContext(Dispatchers.IO) {
        try {
            val printers = BluetoothPrintersConnections()
                .getList()
                .mapNotNull { it.device }
            printers
        } catch (e: Exception) {
            emptyList()
        }
    }
    
    suspend fun connectToPrinter(device: BluetoothDevice): Boolean = withContext(Dispatchers.IO) {
        try {
            // Close existing connection
            currentSocket?.close()
            printer?.disconnectPrinter()
            
            // Create new connection
            val connection = BluetoothPrintersConnections()
                .selectFirstPaired()
            
            if (connection != null) {
                printer = EscPosPrinter(connection, 203, 48f, 32)
                true
            } else {
                false
            }
        } catch (e: EscPosConnectionException) {
            false
        } catch (e: IOException) {
            false
        } catch (e: Exception) {
            false
        }
    }
    
    suspend fun printTodayReceipt(transaction: Transaction): PrintResult = withContext(Dispatchers.IO) {
        try {
            if (!hasBluetoothPermissions()) {
                return@withContext PrintResult.Error("Bluetooth permissions not granted")
            }
            
            val connection = BluetoothPrintersConnections()
                .selectFirstPaired()
                ?: return@withContext PrintResult.Error("No paired printer found")
            
            val escPosPrinter = EscPosPrinter(connection, 203, 48f, 32)
            
            val receiptText = formatReceiptFor58mm(transaction)
            
            escPosPrinter.printFormattedTextAndCut(receiptText)
            
            PrintResult.Success
        } catch (e: EscPosConnectionException) {
            PrintResult.Error("Printer connection failed: ${e.message}")
        } catch (e: EscPosEncodingException) {
            PrintResult.Error("Encoding error: ${e.message}")
        } catch (e: EscPosBarcodeException) {
            PrintResult.Error("Barcode error: ${e.message}")
        } catch (e: IOException) {
            PrintResult.Error("IO error: ${e.message}")
        } catch (e: Exception) {
            PrintResult.Error("Printing failed: ${e.message}")
        }
    }
    
    private fun formatReceiptFor58mm(transaction: Transaction): String {
        val dateFormat = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
        val currentDate = dateFormat.format(Date())
        
        return """
            [C]<u><b>DELIVERY RECEIPT</b></u>
            [C]================================
            
            [L]Date: [R]$currentDate
            [L]Receipt No: [R]${transaction.id.takeLast(8)}
            [C]--------------------------------
            
            [L]<b>DELIVERY DETAILS</b>
            [C]--------------------------------
            
            [L]Cash Collect:[R]${transaction.cashCollect} x 200
            [L][R]${transaction.cashCollect * 200} MMK
            [L]Sender Pay:[R]${transaction.senderPay} x 100
            [L][R]${transaction.senderPay * 100} MMK
            [L]Rejected:[R]${transaction.rejected} x 0
            [L][R]0 MMK
            [L]FOC:[R]${transaction.foc} x 0
            [L][R]0 MMK
            [C]--------------------------------
            
            [L]<b>SUMMARY</b>
            [L]Total Deliveries:[R]${transaction.getTotalDeliveries()}
            [L]Subtotal:[R]${(transaction.cashCollect * 200) + (transaction.senderPay * 100)} MMK
            [L]EC Bonus:[R]${transaction.ec} MMK
            [L]<b>Daily Total:[R]${transaction.dailyTotal} MMK</b>
            [C]================================
            
            [C]<font size='1'>Thank you for your service!</font>
            [C]<font size='1'>CourierEarn App v1.0</font>
            
            [C]
            
        """.trimIndent()
    }
    
    suspend fun printDailySummary(transactions: List<Transaction>): PrintResult = withContext(Dispatchers.IO) {
        try {
            if (!hasBluetoothPermissions()) {
                return@withContext PrintResult.Error("Bluetooth permissions not granted")
            }
            
            if (transactions.isEmpty()) {
                return@withContext PrintResult.Error("No transactions to print")
            }
            
            val connection = BluetoothPrintersConnections()
                .selectFirstPaired()
                ?: return@withContext PrintResult.Error("No paired printer found")
            
            val escPosPrinter = EscPosPrinter(connection, 203, 48f, 32)
            
            val summaryText = formatDailySummaryFor58mm(transactions)
            
            escPosPrinter.printFormattedTextAndCut(summaryText)
            
            PrintResult.Success
        } catch (e: EscPosConnectionException) {
            PrintResult.Error("Printer connection failed: ${e.message}")
        } catch (e: EscPosEncodingException) {
            PrintResult.Error("Encoding error: ${e.message}")
        } catch (e: EscPosBarcodeException) {
            PrintResult.Error("Barcode error: ${e.message}")
        } catch (e: IOException) {
            PrintResult.Error("IO error: ${e.message}")
        } catch (e: Exception) {
            PrintResult.Error("Printing failed: ${e.message}")
        }
    }
    
    private fun formatDailySummaryFor58mm(transactions: List<Transaction>): String {
        val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
        val currentDate = dateFormat.format(Date())
        
        val totalCashCollect = transactions.sumOf { it.cashCollect }
        val totalSenderPay = transactions.sumOf { it.senderPay }
        val totalRejected = transactions.sumOf { it.rejected }
        val totalFoc = transactions.sumOf { it.foc }
        val totalEC = transactions.sumOf { it.ec }
        val totalEarnings = transactions.sumOf { it.dailyTotal }
        val totalDeliveries = transactions.sumOf { it.getTotalDeliveries() }
        
        return """
            [C]<u><b>DAILY SUMMARY REPORT</b></u>
            [C]================================
            
            [L]Date: [R]$currentDate
            [L]Total Transactions:[R]${transactions.size}
            [C]--------------------------------
            
            [L]<b>DELIVERY BREAKDOWN</b>
            [C]--------------------------------
            
            [L]Cash Collect:[R]$totalCashCollect
            [L][R]${totalCashCollect * 200} MMK
            [L]Sender Pay:[R]$totalSenderPay
            [L][R]${totalSenderPay * 100} MMK
            [L]Rejected:[R]$totalRejected
            [L][R]0 MMK
            [L]FOC:[R]$totalFoc
            [L][R]0 MMK
            [C]--------------------------------
            
            [L]<b>DAILY SUMMARY</b>
            [L]Total Deliveries:[R]$totalDeliveries
            [L]Total Earnings:[R]$totalEarnings MMK
            [L]EC Bonus:[R]$totalEC MMK
            [L]<b>Grand Total:[R]${totalEarnings + totalEC} MMK</b>
            [C]================================
            
            [C]<font size='1'>Generated by CourierEarn App</font>
            [C]<font size='1'>$currentDate</font>
            
            [C]
            
        """.trimIndent()
    }
    
    private fun hasBluetoothPermissions(): Boolean {
        return ActivityCompat.checkSelfPermission(
            context,
            android.Manifest.permission.BLUETOOTH_CONNECT
        ) == PackageManager.PERMISSION_GRANTED
    }
    
    fun disconnectPrinter() {
        try {
            printer?.disconnectPrinter()
            currentSocket?.close()
            printer = null
            currentSocket = null
        } catch (e: Exception) {
            // Ignore exceptions during cleanup
        }
    }
    
    fun isPrinterConnected(): Boolean {
        return printer != null && currentSocket?.isConnected == true
    }
}

sealed class PrintResult {
    object Success : PrintResult()
    data class Error(val message: String) : PrintResult()
}
