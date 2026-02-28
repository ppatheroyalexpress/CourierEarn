package com.courierearn.presentation.ui.dataentry

import android.app.DatePickerDialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import com.courierearn.R
import com.courierearn.databinding.FragmentDataEntryBinding
import com.courierearn.presentation.viewmodel.DataEntryViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@AndroidEntryPoint
class DataEntryFragment : Fragment() {
    
    private var _binding: FragmentDataEntryBinding? = null
    private val binding get() = _binding!!
    
    private val viewModel: DataEntryViewModel by viewModels()
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDataEntryBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupClickListeners()
        setupTextWatchers()
        observeViewModel()
        
        // Initialize with today's date
        updateDateDisplay()
    }
    
    private fun setupClickListeners() {
        binding.tvSelectedDate.setOnClickListener {
            showDatePicker()
        }
        
        binding.btnClear.setOnClickListener {
            viewModel.clearForm()
        }
        
        binding.btnSave.setOnClickListener {
            viewModel.saveTransaction()
        }
    }
    
    private fun setupTextWatchers() {
        binding.etCashCollect.addTextChangedListener(createTextWatcher { text ->
            viewModel.updateCashCollectCount(text.toString())
        })
        
        binding.etSenderPay.addTextChangedListener(createTextWatcher { text ->
            viewModel.updateSenderPayCount(text.toString())
        })
        
        binding.etRejected.addTextChangedListener(createTextWatcher { text ->
            viewModel.updateRejectedCount(text.toString())
        })
        
        binding.etEc.addTextChangedListener(createTextWatcher { text ->
            viewModel.updateEcCount(text.toString())
        })
    }
    
    private fun createTextWatcher(onTextChanged: (CharSequence?) -> Unit): android.text.TextWatcher {
        return object : android.text.TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                onTextChanged(s)
            }
            override fun afterTextChanged(s: Editable?, start: Int, before: Int, count: Int) {}
        }
    }
    
    private fun observeViewModel() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.selectedDate.collect { date ->
                updateDateDisplay()
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.dailyTotal.collect { total ->
                binding.tvDailyTotal.text = viewModel.getFormattedDailyTotal()
            }
        }
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.isLoading.collect { isLoading ->
                binding.btnSave.isEnabled = !isLoading
                binding.btnClear.isEnabled = !isLoading
                
                if (isLoading) {
                    binding.btnSave.text = "Saving..."
                } else {
                    binding.btnSave.text = "Save Transaction"
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
        
        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.successMessage.collect { success ->
                success?.let {
                    Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
                    viewModel.clearSuccessMessage()
                    
                    // Navigate back to home screen
                    parentFragmentManager.popBackStack()
                }
            }
        }
    }
    
    private fun showDatePicker() {
        val selectedDate = viewModel.selectedDate.value
        val datePickerDialog = DatePickerDialog(
            requireContext(),
            { _, year, month, dayOfMonth ->
                val selectedLocalDate = LocalDate.of(year, month + 1, dayOfMonth)
                viewModel.updateDate(selectedLocalDate)
            },
            selectedDate.year,
            selectedDate.monthValue - 1,
            selectedDate.dayOfMonth
        )
        
        datePickerDialog.show()
    }
    
    private fun updateDateDisplay() {
        binding.tvSelectedDate.text = viewModel.getSelectedDateFormatted()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
