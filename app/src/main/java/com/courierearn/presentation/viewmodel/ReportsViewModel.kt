package com.courierearn.presentation.viewmodel

import android.content.Context
import android.os.Environment
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.courierearn.domain.model.Transaction
import com.courierearn.domain.repository.TransactionRepository
import com.itextpdf.io.font.constants.StandardFonts
import com.itextpdf.kernel.font.PdfFont
import com.itextpdf.kernel.font.PdfFontFactory
import com.itextpdf.kernel.pdf.PdfDocument
import com.itextpdf.kernel.pdf.PdfWriter
import com.itextpdf.layout.Document
import com.itextpdf.layout.element.Cell
import com.itextpdf.layout.element.Paragraph
import com.itextpdf.layout.element.Table
import com.itextpdf.layout.properties.TextAlignment
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeFormatter
import java.util.*
import javax.inject.Inject

@HiltViewModel
class ReportsViewModel @Inject constructor(
    private val transactionRepository: TransactionRepository,
    @ApplicationContext private val context: Context
) : ViewModel() {
    
    private val _transactions = MutableStateFlow<List<Transaction>>(emptyList())
    val transactions: StateFlow<List<Transaction>> = _transactions.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()
    
    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()
    
    init {
        loadTransactions()
    }
    
    private fun loadTransactions() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                transactionRepository.getAllTransactions().collect { transactionList ->
                    _transactions.value = transactionList
                    _isLoading.value = false
                }
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load transactions: ${e.message}"
                _isLoading.value = false
            }
        }
    }
    
    fun generateMonthlyReport(yearMonth: YearMonth) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            try {
                val monthlyTransactions = _transactions.value.filter { transaction ->
                    transaction.date.year == yearMonth.year && 
                    transaction.date.month == yearMonth.month
                }
                
                val fileName = "Monthly_Report_${yearMonth.year}_${yearMonth.monthValue}.pdf"
                val filePath = generateMonthlyPDF(monthlyTransactions, yearMonth, fileName)
                
                _successMessage.value = "Monthly report saved to: $filePath"
                _isLoading.value = false
            } catch (e: Exception) {
                _errorMessage.value = "Failed to generate monthly report: ${e.message}"
                _isLoading.value = false
            }
        }
    }
    
    fun generateWeeklyReport(startDate: LocalDate, endDate: LocalDate) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            try {
                val weeklyTransactions = _transactions.value.filter { transaction ->
                    !transaction.date.isBefore(startDate) && !transaction.date.isAfter(endDate)
                }
                
                val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                val fileName = "Weekly_Report_${startDate.format(formatter)}_${endDate.format(formatter)}.pdf"
                val filePath = generateWeeklyPDF(weeklyTransactions, startDate, endDate, fileName)
                
                _successMessage.value = "Weekly report saved to: $filePath"
                _isLoading.value = false
            } catch (e: Exception) {
                _errorMessage.value = "Failed to generate weekly report: ${e.message}"
                _isLoading.value = false
            }
        }
    }
    
    private fun generateMonthlyPDF(
        transactions: List<Transaction>,
        yearMonth: YearMonth,
        fileName: String
    ): String {
        val downloadsDir = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "CourierEarn")
        if (!downloadsDir.exists()) {
            downloadsDir.mkdirs()
        }
        
        val pdfFile = File(downloadsDir, fileName)
        val writer = PdfWriter(FileOutputStream(pdfFile))
        val pdf = PdfDocument(writer)
        val document = Document(pdf)
        
        try {
            val font = PdfFontFactory.createFont(StandardFonts.HELVETICA)
            val boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD)
            
            // Title
            document.add(Paragraph("Monthly Earnings Report").setFont(boldFont).setFontSize(18).setTextAlignment(TextAlignment.CENTER))
            document.add(Paragraph("Period: ${yearMonth.month.name} ${yearMonth.year}").setFont(font).setTextAlignment(TextAlignment.CENTER))
            document.add(Paragraph("Generated: ${LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))}").setFont(font).setTextAlignment(TextAlignment.CENTER))
            document.add(Paragraph(" ").setFont(font))
            
            // Summary
            val totalDeliveries = transactions.sumOf { it.getTotalDeliveries() }
            val totalEarnings = transactions.sumOf { it.dailyTotal }
            val totalEC = transactions.sumOf { it.ec }
            
            document.add(Paragraph("SUMMARY").setFont(boldFont).setFontSize(14))
            document.add(Paragraph("Total Deliveries: $totalDeliveries").setFont(font))
            document.add(Paragraph("Total Earnings: $totalEarnings MMK").setFont(font))
            document.add(Paragraph("EC Bonus: $totalEC MMK").setFont(font))
            document.add(Paragraph(" ").setFont(font))
            
            // Transaction Table
            document.add(Paragraph("TRANSACTION DETAILS").setFont(boldFont).setFontSize(14))
            
            val table = Table(floatArrayOf(2f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f))
            
            // Header
            table.addCell(Cell().add(Paragraph("Date").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Cash Collect").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Sender Pay").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Rejected").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("FOC").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("EC").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Daily Total").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Total Del.").setFont(boldFont)))
            
            // Data rows
            transactions.sortedBy { it.date }.forEach { transaction ->
                table.addCell(Cell().add(Paragraph(transaction.date.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.cashCollect.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.senderPay.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.rejected.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.foc.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.ec.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.dailyTotal.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.getTotalDeliveries().toString()).setFont(font)))
            }
            
            document.add(table)
            
        } finally {
            document.close()
        }
        
        return pdfFile.absolutePath
    }
    
    private fun generateWeeklyPDF(
        transactions: List<Transaction>,
        startDate: LocalDate,
        endDate: LocalDate,
        fileName: String
    ): String {
        val downloadsDir = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "CourierEarn")
        if (!downloadsDir.exists()) {
            downloadsDir.mkdirs()
        }
        
        val pdfFile = File(downloadsDir, fileName)
        val writer = PdfWriter(FileOutputStream(pdfFile))
        val pdf = PdfDocument(writer)
        val document = Document(pdf)
        
        try {
            val font = PdfFontFactory.createFont(StandardFonts.HELVETICA)
            val boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD)
            
            // Title
            document.add(Paragraph("Weekly Earnings Report").setFont(boldFont).setFontSize(18).setTextAlignment(TextAlignment.CENTER))
            document.add(Paragraph("Period: ${startDate} to ${endDate}").setFont(font).setTextAlignment(TextAlignment.CENTER))
            document.add(Paragraph("Generated: ${LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))}").setFont(font).setTextAlignment(TextAlignment.CENTER))
            document.add(Paragraph(" ").setFont(font))
            
            // Summary
            val totalDeliveries = transactions.sumOf { it.getTotalDeliveries() }
            val totalEarnings = transactions.sumOf { it.dailyTotal }
            val totalEC = transactions.sumOf { it.ec }
            
            document.add(Paragraph("SUMMARY").setFont(boldFont).setFontSize(14))
            document.add(Paragraph("Total Deliveries: $totalDeliveries").setFont(font))
            document.add(Paragraph("Total Earnings: $totalEarnings MMK").setFont(font))
            document.add(Paragraph("EC Bonus: $totalEC MMK").setFont(font))
            document.add(Paragraph(" ").setFont(font))
            
            // Daily breakdown
            document.add(Paragraph("DAILY BREAKDOWN").setFont(boldFont).setFontSize(14))
            
            val table = Table(floatArrayOf(2f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f))
            
            // Header
            table.addCell(Cell().add(Paragraph("Date").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Cash Collect").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Sender Pay").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Rejected").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("FOC").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("EC").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Daily Total").setFont(boldFont)))
            table.addCell(Cell().add(Paragraph("Total Del.").setFont(boldFont)))
            
            // Data rows
            transactions.sortedBy { it.date }.forEach { transaction ->
                table.addCell(Cell().add(Paragraph(transaction.date.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.cashCollect.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.senderPay.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.rejected.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.foc.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.ec.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.dailyTotal.toString()).setFont(font)))
                table.addCell(Cell().add(Paragraph(transaction.getTotalDeliveries().toString()).setFont(font)))
            }
            
            document.add(table)
            
        } finally {
            document.close()
        }
        
        return pdfFile.absolutePath
    }
    
    fun getCurrentMonthData(): MonthlySummary {
        val currentMonth = YearMonth.now()
        val monthlyTransactions = _transactions.value.filter { transaction ->
            transaction.date.year == currentMonth.year && 
            transaction.date.month == currentMonth.month
        }
        
        return MonthlySummary(
            totalEarnings = monthlyTransactions.sumOf { it.dailyTotal },
            totalDeliveries = monthlyTransactions.sumOf { it.getTotalDeliveries() },
            ecBonus = monthlyTransactions.sumOf { it.ec },
            cashCollectCount = monthlyTransactions.sumOf { it.cashCollect },
            senderPayCount = monthlyTransactions.sumOf { it.senderPay },
            rejectedCount = monthlyTransactions.sumOf { it.rejected },
            focCount = monthlyTransactions.sumOf { it.foc }
        )
    }
    
    fun getCurrentWeekData(): WeeklySummary {
        val today = LocalDate.now()
        val weekStart = today.minusDays(today.dayOfWeek.value % 7L)
        val weekEnd = weekStart.plusDays(6)
        
        val weeklyTransactions = _transactions.value.filter { transaction ->
            !transaction.date.isBefore(weekStart) && !transaction.date.isAfter(weekEnd)
        }
        
        return WeeklySummary(
            totalEarnings = weeklyTransactions.sumOf { it.dailyTotal },
            totalDeliveries = weeklyTransactions.sumOf { it.getTotalDeliveries() },
            ecBonus = weeklyTransactions.sumOf { it.ec },
            cashCollectCount = weeklyTransactions.sumOf { it.cashCollect },
            senderPayCount = weeklyTransactions.sumOf { it.senderPay },
            rejectedCount = weeklyTransactions.sumOf { it.rejected },
            focCount = weeklyTransactions.sumOf { it.foc }
        )
    }
    
    fun clearMessages() {
        _errorMessage.value = null
        _successMessage.value = null
    }
    
    fun refreshData() {
        loadTransactions()
    }
}

data class MonthlySummary(
    val totalEarnings: Int,
    val totalDeliveries: Int,
    val ecBonus: Int,
    val cashCollectCount: Int,
    val senderPayCount: Int,
    val rejectedCount: Int,
    val focCount: Int
)

data class WeeklySummary(
    val totalEarnings: Int,
    val totalDeliveries: Int,
    val ecBonus: Int,
    val cashCollectCount: Int,
    val senderPayCount: Int,
    val rejectedCount: Int,
    val focCount: Int
)
