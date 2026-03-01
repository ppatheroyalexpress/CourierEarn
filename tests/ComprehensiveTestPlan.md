# CourierEarn App - Comprehensive Testing Plan
## Total Test Cases: 88

### 1. Data Entry Functionality (15 Test Cases)

#### 1.1 Basic Data Entry
1. **TC-DE-001**: Verify user can enter Cash Collect count
2. **TC-DE-002**: Verify user can enter Sender Pay count
3. **TC-DE-003**: Verify user can enter Rejected count
4. **TC-DE-004**: Verify user can enter FOC count
5. **TC-DE-005**: Verify user can enter EC Bonus amount

#### 1.2 Data Validation
6. **TC-DE-006**: Verify negative numbers are rejected
7. **TC-DE-007**: Verify decimal numbers are rejected
8. **TC-DE-008**: Verify empty fields are validated
9. **TC-DE-009**: Verify maximum value limits (9999)
10. **TC-DE-010**: Verify zero values are accepted

#### 1.3 Data Persistence
11. **TC-DE-011**: Verify data is saved to local database
12. **TC-DE-012**: Verify data persists after app restart
13. **TC-DE-013**: Verify duplicate date handling
14. **TC-DE-014**: Verify data update functionality
15. **TC-DE-015**: Verify data deletion functionality

### 2. Commission Calculation (20 Test Cases)

#### 2.1 Basic Calculations
16. **TC-CC-001**: Verify Cash Collect calculation (200 MMK each)
17. **TC-CC-002**: Verify Sender Pay calculation (100 MMK each)
18. **TC-CC-003**: Verify Rejected calculation (0 MMK each)
19. **TC-CC-004**: Verify FOC calculation (0 MMK each)
20. **TC-CC-005**: Verify EC Bonus is added directly

#### 2.2 Daily Total Calculations
21. **TC-CC-006**: Verify daily total with only Cash Collect
22. **TC-CC-007**: Verify daily total with only Sender Pay
23. **TC-CC-008**: Verify daily total with mixed deliveries
24. **TC-CC-009**: Verify daily total with EC Bonus
25. **TC-CC-010**: Verify daily total with all types

#### 2.3 Edge Cases
26. **TC-CC-011**: Verify calculation with zero values
27. **TC-CC-012**: Verify calculation with maximum values
28. **TC-CC-013**: Verify calculation precision
29. **TC-CC-014**: Verify negative value handling
30. **TC-CC-015**: Verify large number calculations

#### 2.4 Monthly Calculations
31. **TC-CC-016**: Verify monthly total calculation
32. **TC-CC-017**: Verify monthly average calculation
33. **TC-CC-018**: Verify monthly progress calculation
34. **TC-CC-019**: Verify monthly statistics accuracy
35. **TC-CC-020**: Verify month transition handling

### 3. Reminder System (18 Test Cases)

#### 3.1 Scheduling
36. **TC-RS-001**: Verify 8 PM daily reminder scheduling
37. **TC-RS-002**: Verify reminder persistence after device restart
38. **TC-RS-003**: Verify reminder cancellation
39. **TC-RS-004**: Verify reminder rescheduling
40. **TC-RS-005**: Verify multiple reminder handling

#### 3.2 Data Check Logic
41. **TC-RS-006**: Verify reminder when no data exists
42. **TC-RS-007**: Verify no reminder when data exists
43. **TC-RS-008**: Verify partial data handling
44. **TC-RS-009**: Verify data check accuracy
45. **TC-RS-010**: Verify date boundary handling

#### 3.3 Notification System
46. **TC-RS-011**: Verify notification content
47. **TC-RS-012**: Verify notification timing
48. **TC-RS-013**: Verify notification action
49. **TC-RS-014**: Verify notification channel creation
50. **TC-RS-015**: Verify notification permissions

#### 3.4 Settings Integration
51. **TC-RS-016**: Verify reminder enable/disable toggle
52. **TC-RS-017**: Verify reminder status display
53. **TC-RS-018**: Verify test reminder functionality

### 4. Print Functionality (15 Test Cases)

#### 4.1 Printer Connection
54. **TC-PF-001**: Verify Bluetooth printer discovery
55. **TC-PF-002**: Verify printer pairing
56. **TC-PF-003**: Verify printer connection
57. **TC-PF-004**: Verify connection error handling
58. **TC-PF-005**: Verify connection status display

#### 4.2 Receipt Printing
59. **TC-PF-006**: Verify today's receipt printing
60. **TC-PF-007**: Verify daily summary printing
61. **TC-PF-008**: Verify print layout format
62. **TC-PF-009**: Verify print content accuracy
63. **TC-PF-010**: Verify print quality

#### 4.3 Print Error Handling
64. **TC-PF-011**: Verify no printer error
65. **TC-PF-012**: Verify no data error
66. **TC-PF-013**: Verify connection lost error
67. **TC-PF-014**: Verify print job failure
68. **TC-PF-015**: Verify retry mechanism

### 5. Export Functionality (20 Test Cases)

#### 5.1 PDF Export
69. **TC-EF-001**: Verify monthly PDF export
70. **TC-EF-002**: Verify weekly PDF export
71. **TC-EF-003**: Verify PDF file creation
72. **TC-EF-004**: Verify PDF content accuracy
73. **TC-EF-004**: Verify PDF layout format

#### 5.2 PDF Content
74. **TC-EF-005**: Verify PDF header information
75. **TC-EF-006**: Verify PDF summary section
76. **TC-EF-007**: Verify PDF transaction table
77. **TC-EF-008**: Verify PDF calculations
78. **TC-EF-009**: Verify PDF formatting

#### 5.3 File Management
79. **TC-EF-010**: Verify file saving location
80. **TC-EF-011**: Verify file naming convention
81. **TC-EF-012**: Verify file overwrite handling
82. **TC-EF-013**: Verify storage permissions
83. **TC-EF-014**: Verify file accessibility

#### 5.4 Export Error Handling
84. **TC-EF-015**: Verify no data export error
85. **TC-EF-016**: Verify storage full error
86. **TC-EF-017**: Verify permission denied error
87. **TC-EF-018**: Verify export failure handling
88. **TC-EF-019**: Verify export progress indication

## Testing Priority
1. **Critical**: Data Entry, Commission Calculation
2. **High**: Print Functionality, Export Functionality
3. **Medium**: Reminder System

## Test Environment
- **Device**: Android 10+ devices
- **Printer**: 58mm Bluetooth Thermal Printer
- **Storage**: External storage with write permissions
- **Network**: Not required for core functionality

## Success Criteria
- All critical test cases pass
- No app crashes during testing
- All calculations are accurate
- All exports generate valid files
- All prints produce readable receipts
