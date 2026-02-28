package com.courierearn.presentation.ui.home.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.courierearn.databinding.ItemTransactionPreviewBinding
import com.courierearn.domain.model.Transaction
import java.text.SimpleDateFormat
import java.util.*

class TransactionPreviewAdapter : ListAdapter<Transaction, TransactionPreviewAdapter.TransactionViewHolder>(TransactionDiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TransactionViewHolder {
        val binding = ItemTransactionPreviewBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return TransactionViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: TransactionViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    class TransactionViewHolder(
        private val binding: ItemTransactionPreviewBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        
        fun bind(transaction: Transaction) {
            val dateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            
            binding.tvTransactionDate.text = dateFormat.format(
                java.sql.Date.valueOf(transaction.date)
            )
            binding.tvTransactionSummary.text = transaction.getTransactionSummary()
            binding.tvTransactionTotal.text = "${transaction.dailyTotal} MMK"
        }
    }
    
    private class TransactionDiffCallback : DiffUtil.ItemCallback<Transaction>() {
        override fun areItemsTheSame(oldItem: Transaction, newItem: Transaction): Boolean {
            return oldItem.id == newItem.id
        }
        
        override fun areContentsTheSame(oldItem: Transaction, newItem: Transaction): Boolean {
            return oldItem == newItem
        }
    }
}
