package com.courierearn.presentation.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.courierearn.R
import com.courierearn.databinding.FragmentHomeBinding
import com.courierearn.domain.model.HomeScreenData
import com.courierearn.domain.model.Transaction
import com.courierearn.presentation.ui.home.adapter.TransactionPreviewAdapter
import com.courierearn.presentation.viewmodel.HomeViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@AndroidEntryPoint
class HomeFragment : Fragment() {
    
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: HomeViewModel by viewModels()
    private lateinit var transactionAdapter: TransactionPreviewAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupRecyclerView()
        setupClickListeners()
        observeViewModel()
    }
    
    private fun setupRecyclerView() {
        transactionAdapter = TransactionPreviewAdapter()
        binding.rvRecentTransactions.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = transactionAdapter
            isNestedScrollingEnabled = false
        }
    }
    
    private fun setupClickListeners() {
        binding.btnAddData.setOnClickListener {
            // Navigate to Data Entry
            // TODO: Implement navigation
        }
        
        binding.btnViewReports.setOnClickListener {
            // Navigate to Reports
            // TODO: Implement navigation
        }
        
        binding.tvViewAll.setOnClickListener {
            // Navigate to Calendar/Reports
            // TODO: Implement navigation
        }
    }
    
    private fun observeViewModel() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.homeScreenData.collect { data ->
                data?.let {
                    updateUI(it)
                }
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.errorMessage.collect { error ->
                error?.let {
                    Toast.makeText(requireContext(), it, Toast.LENGTH_LONG).show()
                    viewModel.clearError()
                }
            }
        }
    }
    
    private fun updateUI(data: com.courierearn.domain.model.HomeScreenData) {
        // Update user info
        binding.tvUserName.text = data.userName
        
        // Update current date
        val dateFormat = SimpleDateFormat("EEEE, MMMM dd, yyyy", Locale.getDefault())
        binding.tvCurrentDate.text = "Today, ${dateFormat.format(Date())}"
        
        // Update yesterday's commission
        binding.tvYesterdayCommission.text = "${data.yesterdayCommission.totalAmount} MMK"
        binding.tvYesterdayDeliveries.text = "${data.yesterdayCommission.totalDeliveries} deliveries"
        
        // Update today's commission
        binding.tvTodayCommission.text = "${data.todayCommission.totalAmount} MMK"
        binding.tvTodayDeliveries.text = "${data.todayCommission.totalDeliveries} deliveries"
        
        // Update month to date
        binding.tvMonthTotal.text = "${data.monthToDateData.totalAmount} MMK"
        binding.tvMonthDeliveries.text = "${data.monthToDateData.totalDeliveries} deliveries"
        binding.tvEcBonus.text = data.monthToDateData.getFormattedEcBonus()
        binding.tvMonthProgress.text = data.monthToDateData.getFormattedProgress()
        binding.progressMonth.progress = data.monthToDateData.progressPercentage
        
        // Update recent transactions
        transactionAdapter.submitList(data.recentTransactions)
        
        // Show/hide empty state
        if (data.recentTransactions.isEmpty()) {
            binding.rvRecentTransactions.visibility = View.GONE
            binding.tvNoTransactions.visibility = View.VISIBLE
        } else {
            binding.rvRecentTransactions.visibility = View.VISIBLE
            binding.tvNoTransactions.visibility = View.GONE
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
