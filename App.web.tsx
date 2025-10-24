import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

type Page = 'home' | 'upload' | 'results' | 'about' | 'contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [bodyImage, setBodyImage] = useState<string>('');
  const [faceImage, setFaceImage] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGetStarted = () => {
    setCurrentPage('upload');
  };

  const handleAnalyze = (body: string, face: string) => {
    setBodyImage(body);
    setFaceImage(face);
    setCurrentPage('results');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'upload':
        return <UploadPage onAnalyze={handleAnalyze} />;
      case 'results':
        return bodyImage && faceImage ? (
          <ResultPage bodyImage={bodyImage} faceImage={faceImage} />
        ) : (
          <UploadPage onAnalyze={handleAnalyze} />
        );
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <View style={styles.container}>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <View style={styles.main}>
        {renderPage()}
      </View>
      <Footer />
    </View>
  );
}

// Landing Page Component
interface LandingPageProps {
  onGetStarted: () => void;
}

function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: '✨',
      title: 'AI-Powered Analysis',
      description: 'Upload your photos and let our advanced AI analyze your body type and face shape'
    },
    {
      icon: '👗',
      title: 'Personalized Style',
      description: 'Get custom clothing recommendations tailored specifically to your unique features'
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Receive hairstyle and color suggestions in seconds with visual previews'
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.sparkleIcon}>✨</Text>
        </View>

        <Text style={styles.title}>
          Discover Your Perfect Style with{' '}
          <Text style={styles.highlight}>AI</Text>
        </Text>

        <Text style={styles.subtitle}>
          Upload your photos and get personalized fashion recommendations, hairstyle suggestions,
          and color palettes tailored to your unique body type and face shape.
        </Text>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresSection}>
        {features.map((feature, index) => (
          <View
            key={feature.title}
            style={styles.featureCard}
          >
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Upload Page Component
interface UploadPageProps {
  onAnalyze: (bodyImage: string, faceImage: string) => void;
}

function UploadPage({ onAnalyze }: UploadPageProps) {
  const [bodyPreview, setBodyPreview] = useState<string | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImage = async (type: 'body' | 'face') => {
    // For web, we'll use a simple file input simulation
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (type === 'body') {
            setBodyPreview(result);
          } else {
            setFacePreview(result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const clearImage = (type: 'body' | 'face') => {
    if (type === 'body') {
      setBodyPreview(null);
    } else {
      setFacePreview(null);
    }
  };

  const handleAnalyze = () => {
    if (bodyPreview && facePreview) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        onAnalyze(bodyPreview, facePreview);
      }, 2000);
    } else {
      Alert.alert('Please upload both photos', 'You need to upload both body and face photos to proceed with analysis.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Your Photos</Text>
        <Text style={styles.subtitle}>
          Upload clear photos of your body and face for personalized AI analysis
        </Text>
      </View>

      <View style={styles.uploadContainer}>
        <UploadCard
          title="Body Photo"
          description="Full body photo for style analysis"
          preview={bodyPreview}
          onPress={() => pickImage('body')}
          onClear={() => clearImage('body')}
        />

        <UploadCard
          title="Face Photo"
          description="Clear face photo for hairstyle recommendations"
          preview={facePreview}
          onPress={() => pickImage('face')}
          onClear={() => clearImage('face')}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.analyzeButton,
          (!bodyPreview || !facePreview || isAnalyzing) && styles.disabledButton
        ]}
        onPress={handleAnalyze}
        disabled={!bodyPreview || !facePreview || isAnalyzing}
        activeOpacity={0.8}
      >
        {isAnalyzing ? (
          <>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.buttonText}>Analyzing...</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>Analyze Photos</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// Upload Card Component
interface UploadCardProps {
  title: string;
  description: string;
  preview: string | null;
  onPress: () => void;
  onClear: () => void;
}

function UploadCard({ title, description, preview, onPress, onClear }: UploadCardProps) {
  return (
    <View style={styles.uploadCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>

      {preview ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: preview }} style={styles.previewImage} />
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadArea} onPress={onPress}>
          <Text style={styles.uploadIcon}>📁</Text>
          <Text style={styles.uploadText}>Tap to upload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Result Page Component
interface ResultPageProps {
  bodyImage: string;
  faceImage: string;
}

function ResultPage({ bodyImage, faceImage }: ResultPageProps) {
  const clothingRecommendations = [
    {
      id: 1,
      name: 'Classic Blazer',
      type: 'Outerwear',
      color: 'Navy Blue',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Fitted Dress',
      type: 'Formal Wear',
      color: 'Emerald Green',
      image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Casual Jeans',
      type: 'Bottoms',
      color: 'Dark Denim',
      image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 4,
      name: 'Silk Blouse',
      type: 'Tops',
      color: 'Cream',
      image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const hairstyleRecommendations = [
    {
      id: 1,
      name: 'Layered Cut',
      description: 'Soft layers with movement',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Bob Style',
      description: 'Classic shoulder-length bob',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Textured Waves',
      description: 'Natural beachy waves',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const hairColors = [
    { name: 'Warm Brunette', hex: '#6B4423' },
    { name: 'Honey Blonde', hex: '#D4A574' },
    { name: 'Auburn', hex: '#A0522D' },
    { name: 'Chestnut', hex: '#954535' }
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Personalized Results</Text>
        <Text style={styles.subtitle}>
          AI-powered style recommendations tailored just for you
        </Text>
      </View>

      {/* Body Analysis */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>👤</Text>
          <Text style={styles.sectionTitle}>Body Analysis</Text>
        </View>
        <View style={styles.analysisContainer}>
          <Image source={{ uri: bodyImage }} style={styles.analysisImage} />
          <View style={styles.analysisInfo}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Detected Body Type</Text>
              <Text style={styles.infoValue}>Hourglass</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Best Fit Styles</Text>
              <Text style={styles.infoText}>Fitted waistlines, A-line cuts, wrap dresses</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Clothing Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>👕</Text>
          <Text style={styles.sectionTitle}>Clothing Recommendations</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.recommendationsContainer}>
            {clothingRecommendations.map((item) => (
              <View key={item.id} style={styles.recommendationCard}>
                <Image source={{ uri: item.image }} style={styles.recommendationImage} />
                <View style={styles.recommendationInfo}>
                  <Text style={styles.recommendationName}>{item.name}</Text>
                  <Text style={styles.recommendationType}>{item.type}</Text>
                  <View style={styles.colorInfo}>
                    <Text style={styles.colorIcon}>🎨</Text>
                    <Text style={styles.colorText}>{item.color}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Face Analysis */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>👤</Text>
          <Text style={styles.sectionTitle}>Face Analysis</Text>
        </View>
        <View style={styles.analysisContainer}>
          <Image source={{ uri: faceImage }} style={styles.analysisImage} />
          <View style={styles.analysisInfo}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Detected Face Shape</Text>
              <Text style={styles.infoValue}>Oval</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Best Features</Text>
              <Text style={styles.infoText}>Balanced proportions, versatile styling options</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Hairstyle Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>✂️</Text>
          <Text style={styles.sectionTitle}>Hairstyle Recommendations</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.recommendationsContainer}>
            {hairstyleRecommendations.map((style) => (
              <View key={style.id} style={styles.recommendationCard}>
                <Image source={{ uri: style.image }} style={styles.recommendationImage} />
                <View style={styles.recommendationInfo}>
                  <Text style={styles.recommendationName}>{style.name}</Text>
                  <Text style={styles.recommendationDescription}>{style.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Hair Colors */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🎨</Text>
          <Text style={styles.sectionTitle}>Recommended Hair Colors</Text>
        </View>
        <View style={styles.colorContainer}>
          {hairColors.map((color) => (
            <View key={color.name} style={styles.colorCard}>
              <View
                style={[styles.colorCircle, { backgroundColor: color.hex }]}
              />
              <Text style={styles.colorName}>{color.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// About Page Component
function AboutPage() {
  const features = [
    {
      icon: '🎯',
      title: 'Our Mission',
      description: 'Empower everyone to look and feel their best through personalized AI-driven style recommendations'
    },
    {
      icon: '✨',
      title: 'Our Technology',
      description: 'Advanced computer vision and machine learning algorithms trained on thousands of fashion and style data points'
    },
    {
      icon: '❤️',
      title: 'Our Values',
      description: 'Inclusivity, authenticity, and empowerment through personalized style guidance for every individual'
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>About SmartFit: AI</Text>
        <Text style={styles.subtitle}>
          Revolutionizing personal style with artificial intelligence
        </Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.contentText}>
          SmartFit: AI is an innovative platform that combines cutting-edge artificial
          intelligence with fashion expertise to help you discover your perfect style.
          Our advanced algorithms analyze your unique body type and face shape to provide
          personalized recommendations that enhance your natural features.
        </Text>
        <Text style={styles.contentText}>
          Whether you're looking to refresh your wardrobe, try a new hairstyle, or
          experiment with different hair colors, SmartFit: AI provides instant, accurate,
          and tailored suggestions that work specifically for you.
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature) => (
          <View key={feature.title} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// Contact Page Component
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Please fill all fields', 'All fields are required to send your message.');
      return;
    }
    
    Alert.alert('Thank you!', 'Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.subtitle}>
          Have questions or feedback? We'd love to hear from you
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <input
            style={styles.input}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.inputIcon}>📧</Text>
            <input
              style={styles.emailInput}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              type="email"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Message</Text>
          <View style={styles.messageContainer}>
            <Text style={styles.messageIcon}>💬</Text>
            <textarea
              style={styles.messageInput}
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Your message..."
              rows={6}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Send Message</Text>
          <Text style={styles.sendIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={styles.contactTitle}>Email Us</Text>
          <Text style={styles.contactText}>support@smartfit-ai.com</Text>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>💬</Text>
          <Text style={styles.contactTitle}>Live Chat</Text>
          <Text style={styles.contactText}>Available 24/7</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Navbar Component
interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const navItems = ['home', 'about', 'contact'];

  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => onNavigate('home')}
        >
          <Text style={styles.logoIcon}>✨</Text>
          <Text style={styles.logoText}>
            SmartFit<span style={styles.logoHighlight}>: AI</span>
          </Text>
        </TouchableOpacity>

        <View style={styles.navItems}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onNavigate(item)}
              style={[
                styles.navItem,
                currentPage === item && styles.activeNavItem
              ]}
            >
              <Text style={[
                styles.navItemText,
                currentPage === item && styles.activeNavItemText
              ]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Footer Component
function Footer() {
  const socialLinks = [
    { icon: '📷', label: 'Instagram' },
    { icon: '🐦', label: 'Twitter' },
    { icon: '🐙', label: 'Github' },
    { icon: '💼', label: 'LinkedIn' }
  ];

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <Text style={styles.footerText}>
          &copy; 2025 SmartFit: AI. All rights reserved.
        </Text>

        <View style={styles.socialLinks}>
          {socialLinks.map(({ icon, label }) => (
            <TouchableOpacity
              key={label}
              style={styles.socialLink}
            >
              <Text style={styles.socialIcon}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
  },
  navbar: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  navbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  logoHighlight: {
    color: '#f43f5e',
  },
  navItems: {
    flexDirection: 'row',
    gap: 32,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#f43f5e',
  },
  navItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeNavItemText: {
    color: '#f43f5e',
  },
  footer: {
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 'auto',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  socialLink: {
    padding: 8,
  },
  socialIcon: {
    fontSize: 20,
  },
  // Landing Page Styles
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: '60vh',
  },
  iconContainer: {
    marginBottom: 24,
  },
  sparkleIcon: {
    fontSize: 64,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 56,
  },
  highlight: {
    color: '#f43f5e',
  },
  subtitle: {
    fontSize: 20,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
    maxWidth: 800,
  },
  getStartedButton: {
    backgroundColor: '#f43f5e',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#ffffff',
    fontSize: 18,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    backgroundColor: '#fdf2f8',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Upload Page Styles
  uploadContainer: {
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  previewContainer: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: '#6b7280',
  },
  analyzeButton: {
    backgroundColor: '#f43f5e',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 20,
    marginHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  // Result Page Styles
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  analysisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  analysisImage: {
    width: 200,
    height: 160,
    borderRadius: 12,
  },
  analysisInfo: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fdf2f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  infoText: {
    fontSize: 14,
    color: '#111827',
  },
  recommendationsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    width: 160,
    overflow: 'hidden',
  },
  recommendationImage: {
    width: '100%',
    height: 120,
  },
  recommendationInfo: {
    padding: 12,
  },
  recommendationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recommendationType: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  colorText: {
    fontSize: 12,
    color: '#374151',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorCard: {
    alignItems: 'center',
    width: 100,
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  colorName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  // About Page Styles
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  // Contact Page Styles
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    width: '100%',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
    fontSize: 20,
  },
  emailInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    border: 'none',
    outline: 'none',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messageIcon: {
    marginRight: 12,
    marginTop: 4,
    fontSize: 20,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    minHeight: 120,
    border: 'none',
    outline: 'none',
    resize: 'none',
  },
  submitButton: {
    backgroundColor: '#f43f5e',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 20,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});