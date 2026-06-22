import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../utils/validators.dart';
import '../../utils/formatters.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();

  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _cnicController = TextEditingController();
  final _addressController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _otpController = TextEditingController();

  bool _showPassword = false;
  bool _agreeToTerms = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _cnicController.dispose();
    _addressController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _handleStep1Submit() {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please agree to Terms & Conditions'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    setState(() => _currentStep = 1);
  }

  void _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await context.read<AuthProvider>().signup(
      fullName: _fullNameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      cnic: _cnicController.text.trim(),
      address: _addressController.text.trim(),
      password: _passwordController.text,
    );

    if (mounted) {
      if (success) {
        // Verify OTP
        final otpSuccess = await context
            .read<AuthProvider>()
            .verifyOTP(_otpController.text.trim());

        if (otpSuccess) {
          context.go('/');
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                context.read<AuthProvider>().error ??
                    'OTP verification failed',
              ),
              backgroundColor: AppTheme.errorColor,
            ),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              context.read<AuthProvider>().error ??
                  'Signup failed',
            ),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Account'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        padding: EdgeInsets.fromLTRB(
          24,
          24,
          24,
          24 + MediaQuery.viewPaddingOf(context).bottom,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
              const SizedBox(height: 20),
              Text(
                'Get Started',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 8),
              Text(
                _currentStep == 0
                    ? 'Create your account with us'
                    : 'Verify your phone number',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 30),

              // Progress Indicator
              Row(
                children: [
                  _stepCircle(0),
                  Expanded(
                    child: Container(
                      height: 2,
                      margin: const EdgeInsets.symmetric(horizontal: 8),
                      color: _currentStep > 0
                          ? AppTheme.primaryColor
                          : AppTheme.darkBorder,
                    ),
                  ),
                  _stepCircle(1),
                ],
              ),
              const SizedBox(height: 30),

              Form(
                key: _formKey,
                child: _currentStep == 0
                    ? _buildStep1()
                    : _buildStep2(),
              ),
            ],
        ),
      ),
    );
  }

  Widget _stepCircle(int index) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: _currentStep >= index
            ? AppTheme.primaryColor
            : AppTheme.darkBorder,
      ),
      child: Center(
        child: Text(
          '${index + 1}',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildStep1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Full Name
        Text(
          'Full Name',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _fullNameController,
          decoration: const InputDecoration(
            hintText: 'Enter your full name',
            prefixIcon: Icon(Icons.person_outline),
          ),
          validator: Validators.validateFullName,
        ),
        const SizedBox(height: 20),

        // Email
        Text(
          'Email Address',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _emailController,
          decoration: const InputDecoration(
            hintText: 'Enter your email',
            prefixIcon: Icon(Icons.email_outlined),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: Validators.validateEmail,
        ),
        const SizedBox(height: 20),

        // CNIC
        Text(
          'CNIC Number',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _cnicController,
          decoration: const InputDecoration(
            hintText: '12345-1234567-1',
            prefixIcon: Icon(Icons.card_membership),
          ),
          inputFormatters: [Formatters.cnicFormatter],
          validator: Validators.validateCNIC,
        ),
        const SizedBox(height: 20),

        // Address
        Text(
          'Address',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _addressController,
          decoration: const InputDecoration(
            hintText: 'Enter your full address',
            prefixIcon: Icon(Icons.location_on_outlined),
          ),
          validator: Validators.validateAddress,
          maxLines: 2,
        ),
        const SizedBox(height: 20),

        // Phone
        Text(
          'Phone Number',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 14,
              ),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  bottomLeft: Radius.circular(12),
                ),
                border: Border.all(color: AppTheme.darkBorder),
              ),
              child: const Text(
                '🇵🇰 +92',
                style: TextStyle(color: AppTheme.textSecondary),
              ),
            ),
            Expanded(
              child: TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  hintText: '300-1234567',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.only(
                      topRight: Radius.circular(12),
                      bottomRight: Radius.circular(12),
                    ),
                  ),
                ),
                inputFormatters: [Formatters.phoneFormatter],
                validator: Validators.validatePhone,
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Password
        Text(
          'Password',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _passwordController,
          decoration: InputDecoration(
            hintText: 'Create a password',
            prefixIcon: const Icon(Icons.lock_outlined),
            suffixIcon: IconButton(
              icon: Icon(
                _showPassword ? Icons.visibility : Icons.visibility_off,
              ),
              onPressed: () =>
                  setState(() => _showPassword = !_showPassword),
            ),
          ),
          obscureText: !_showPassword,
          validator: Validators.validatePassword,
        ),
        const SizedBox(height: 20),

        // Confirm Password
        Text(
          'Confirm Password',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        TextFormField(
          controller: _confirmPasswordController,
          decoration: const InputDecoration(
            hintText: 'Confirm your password',
            prefixIcon: Icon(Icons.lock_outlined),
          ),
          obscureText: true,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please confirm your password';
            }
            if (value != _passwordController.text) {
              return 'Passwords do not match';
            }
            return null;
          },
        ),
        const SizedBox(height: 20),

        // Terms Checkbox
        Row(
          children: [
            Checkbox(
              value: _agreeToTerms,
              onChanged: (value) =>
                  setState(() => _agreeToTerms = value ?? false),
              activeColor: AppTheme.primaryColor,
            ),
            Expanded(
              child: RichText(
                text: TextSpan(
                  text: 'I agree to ',
                  style: Theme.of(context).textTheme.bodySmall,
                  children: [
                    TextSpan(
                      text: 'Terms & Conditions',
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(
                        color: AppTheme.secondaryColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 32),

        // Next Button
        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.secondaryColor,
            ),
            onPressed: _handleStep1Submit,
            child: const Text('Send OTP'),
          ),
        ),
        const SizedBox(height: 16),

        // Already have account
        Center(
          child: RichText(
            text: TextSpan(
              text: 'Already have an account? ',
              style: Theme.of(context).textTheme.bodySmall,
              children: [
                TextSpan(
                  text: 'Login',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(
                    color: AppTheme.secondaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                  recognizer: TapGestureRecognizer()
                    ..onTap = () => context.pushNamed('login'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildStep2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Enter OTP',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        Text(
          'We\'ve sent a 6-digit code to +92 ${_phoneController.text}',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 20),
        TextFormField(
          controller: _otpController,
          decoration: const InputDecoration(
            hintText: '000000',
            prefixIcon: Icon(Icons.code),
          ),
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 24,
            letterSpacing: 8,
            fontWeight: FontWeight.bold,
          ),
          maxLength: 6,
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter OTP';
            }
            if (value.length != 6) {
              return 'OTP must be 6 digits';
            }
            return null;
          },
        ),
        const SizedBox(height: 32),

        // Verify Button
        Consumer<AuthProvider>(
          builder: (context, authProvider, _) {
            return SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondaryColor,
                ),
                onPressed: authProvider.isLoading ? null : _handleSignup,
                child: authProvider.isLoading
                    ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Colors.white,
                    ),
                  ),
                )
                    : const Text('Verify & Create Account'),
              ),
            );
          },
        ),
        const SizedBox(height: 16),

        // Back Button
        SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: () => setState(() => _currentStep = 0),
            child: const Text('Edit Details'),
          ),
        ),

        const SizedBox(height: 32),

        // Resend Code
        Center(
          child: RichText(
            text: TextSpan(
              text: 'Didn\'t receive code? ',
              style: Theme.of(context).textTheme.bodySmall,
              children: [
                TextSpan(
                  text: 'Resend',
                  style: Theme.of(context)
                      .textTheme
                      .bodySmall
                      ?.copyWith(
                    color: AppTheme.secondaryColor,
                    fontWeight: FontWeight.bold,
                  ),
                  recognizer: TapGestureRecognizer()
                    ..onTap = () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('OTP resent successfully'),
                        ),
                      );
                    },
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}