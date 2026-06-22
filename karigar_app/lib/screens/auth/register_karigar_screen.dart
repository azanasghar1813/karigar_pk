import 'dart:io';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../utils/validators.dart';
import '../../utils/formatters.dart';
import '../../providers/auth_provider.dart';

class RegisterKarigarScreen extends StatefulWidget {
  const RegisterKarigarScreen({super.key});

  @override
  State<RegisterKarigarScreen> createState() => _RegisterKarigarScreenState();
}

class _RegisterKarigarScreenState extends State<RegisterKarigarScreen> {
  final _formKey = GlobalKey<FormState>();

  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cnicController = TextEditingController();
  final _addressController = TextEditingController();
  final _serviceController = TextEditingController();
  final _experienceController = TextEditingController();
  final _priceController = TextEditingController();
  final _bioController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _showPassword = false;
  File? _profileImage;
  File? _cnicFrontImage;
  File? _cnicBackImage;
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage(String type) async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        if (type == 'profile') _profileImage = File(image.path);
        if (type == 'cnic_front') _cnicFrontImage = File(image.path);
        if (type == 'cnic_back') _cnicBackImage = File(image.path);
      });
    }
  }

  void _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please agree to Terms & Conditions')),
      );
      return;
    }
    
    if (_profileImage == null || _cnicFrontImage == null || _cnicBackImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please upload all required images')),
      );
      return;
    }

    final success = await context.read<AuthProvider>().registerKarigar(
      fullName: _fullNameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      cnic: _cnicController.text.trim(),
      address: _addressController.text.trim(),
      password: _passwordController.text,
      service: selectedService,
      experience: int.tryParse(_experienceController.text) ?? 0,
      pricePerHour: double.tryParse(_priceController.text) ?? 0,
      bio: _bioController.text.trim(),
      profileImagePath: _profileImage!.path,
      cnicFrontPath: _cnicFrontImage!.path,
      cnicBackPath: _cnicBackImage!.path,
    );

    if (mounted) {
      if (success) {
        context.go('/');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(context.read<AuthProvider>().error ?? 'Registration failed'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  String selectedService = 'Electrician';
  bool _agreeToTerms = false;

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _cnicController.dispose();
    _addressController.dispose();
    _serviceController.dispose();
    _experienceController.dispose();
    _priceController.dispose();
    _bioController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register as Karigar'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
        child: Padding(
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
                'Join as Professional',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Register your service profile and start earning',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              const SizedBox(height: 30),

              Form(
                key: _formKey,
                child: Column(
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
                        hintText: 'Your full name',
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
                        hintText: 'Your email',
                        prefixIcon: Icon(Icons.email_outlined),
                      ),
                      keyboardType: TextInputType.emailAddress,
                      validator: Validators.validateEmail,
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
                        hintText: 'Your full address',
                        prefixIcon: Icon(Icons.location_on_outlined),
                      ),
                      validator: Validators.validateAddress,
                      maxLines: 2,
                    ),
                    const SizedBox(height: 20),

                    // Service
                    Text(
                      'Service Type',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: selectedService,
                      items: [
                        'Electrician',
                        'Plumber',
                        'Carpenter',
                        'AC Repair',
                        'Painter',
                        'Locksmith',
                        'CCTV Installation',
                        'General Repair',
                      ]
                          .map((service) => DropdownMenuItem(
                        value: service,
                        child: Text(service),
                      ))
                          .toList(),
                      onChanged: (value) {
                        setState(() => selectedService = value ?? 'Electrician');
                      },
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.work_outline),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Experience
                    Text(
                      'Years of Experience',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _experienceController,
                      decoration: const InputDecoration(
                        hintText: 'e.g., 5',
                        prefixIcon: Icon(Icons.timeline),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter years of experience';
                        }
                        if (int.tryParse(value) == null) {
                          return 'Please enter a valid number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Price per Hour
                    Text(
                      'Price per Hour (Rs)',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _priceController,
                      decoration: const InputDecoration(
                        hintText: '500',
                        prefixIcon: Icon(Icons.paid_outlined),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter price';
                        }
                        if (int.tryParse(value) == null) {
                          return 'Please enter a valid number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Bio
                    Text(
                      'Bio (Optional)',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _bioController,
                      decoration: const InputDecoration(
                        hintText: 'Tell customers about yourself',
                        prefixIcon: Icon(Icons.info_outline),
                      ),
                      maxLines: 3,
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

                    // Images Upload Section
                    Text(
                      'Document Uploads',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    _buildImagePickerItem('Profile Photo', _profileImage, 'profile'),
                    const SizedBox(height: 12),
                    _buildImagePickerItem('CNIC Front', _cnicFrontImage, 'cnic_front'),
                    const SizedBox(height: 12),
                    _buildImagePickerItem('CNIC Back', _cnicBackImage, 'cnic_back'),
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

                    // Register Button
                    Consumer<AuthProvider>(
                      builder: (context, authProvider, _) {
                        return SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.secondaryColor,
                            ),
                            onPressed: (!_agreeToTerms || authProvider.isLoading) ? null : _handleRegister,
                            child: authProvider.isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : const Text('Register as Karigar'),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 16),

                    // Already registered
                    Center(
                      child: RichText(
                        text: TextSpan(
                          text: 'Already registered? ',
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
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildImagePickerItem(String title, File? file, String type) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.darkBorder),
      ),
      child: ListTile(
        leading: file != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.file(file, width: 40, height: 40, fit: BoxFit.cover),
              )
            : Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.image, color: AppTheme.primaryColor),
              ),
        title: Text(title, style: Theme.of(context).textTheme.bodyMedium),
        trailing: TextButton(
          onPressed: () => _pickImage(type),
          child: const Text('Upload'),
        ),
      ),
    );
  }
}