package com.courierearn.di

import com.courierearn.domain.repository.SettingsRepository
import com.courierearn.domain.repository.TransactionRepository
import com.courierearn.data.repository.SettingsRepositoryMapper
import com.courierearn.data.repository.TransactionRepositoryMapper
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    
    @Binds
    @Singleton
    abstract fun bindTransactionRepository(
        transactionRepositoryMapper: TransactionRepositoryMapper
    ): TransactionRepository
    
    @Binds
    @Singleton
    abstract fun bindSettingsRepository(
        settingsRepositoryMapper: SettingsRepositoryMapper
    ): SettingsRepository
}
