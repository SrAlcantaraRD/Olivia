# Meta tags, structured data schemas, Core Web Vitals

**Note:** The Oliva app is a mobile application. SEO refers to App Store Optimization (ASO) and metadata for web-based features.

## App Store metadata

### App Store Connect configuration

```xml
<!-- ios/Runner/Info.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- Basic app information -->
  <key>CFBundleDisplayName</key>
  <string>Oliva</string>
  <key>CFBundleName</key>
  <string>Oliva</string>
  <key>CFBundleIdentifier</key>
  <string>com.oliva.app</string>
  <key>CFBundleVersion</key>
  <string>1.0.0</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>

  <!-- SEO-optimized description -->
  <key>CFBundleDescription</key>
  <string>Professional intermittent catheterization management for patients and caregivers. Track procedures, monitor health metrics, and maintain detailed medical records with ease.</string>

  <!-- Keywords for App Store search -->
  <key>LSApplicationQueriesSchemes</key>
  <array>
    <string>intermittent-catheterization</string>
    <string>bladder-management</string>
    <string>medical-records</string>
    <string>patient-care</string>
    <string>health-tracking</string>
  </array>

  <!-- Category and genre -->
  <key>LSApplicationCategoryType</key>
  <string>public.app-category.medical</string>

  <!-- Supported languages -->
  <key>CFBundleLocalizations</key>
  <array>
    <string>en</string>
    <string>es</string>
    <string>ca</string>
  </array>
</dict>
</plist>
```

### Google Play metadata

```json
// android/app/build.gradle
android {
  defaultConfig {
    applicationId "com.oliva.app"
    minSdkVersion 21
    targetSdkVersion 34
    versionCode 1
    versionName "1.0.0"

    // App Store description
    manifestPlaceholders = [
      appName: "Oliva - Catheterization Management",
      appDescription: "Professional intermittent catheterization management for patients and caregivers. Track procedures, monitor health metrics, and maintain detailed medical records with ease.",
      appKeywords: "intermittent catheterization, bladder management, medical records, patient care, health tracking"
    ]
  }
}
```

## Structured data for web features

### Healthcare schema markup

```html
<!-- public/index.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalApplication",
  "name": "Oliva",
  "description": "Professional intermittent catheterization management application for patients and caregivers",
  "applicationCategory": "HealthcareApplication",
  "operatingSystem": "iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Oliva Health"
  },
  "medicalSpecialty": "Urology",
  "healthCondition": {
    "@type": "MedicalCondition",
    "name": "Neurogenic Bladder",
    "code": {
      "@type": "MedicalCode",
      "codeValue": "N31.9",
      "codingSystem": "ICD-10"
    }
  },
  "potentialAction": {
    "@type": "DownloadAction",
    "target": [
      {
        "@type": "EntryPoint",
        "urlTemplate": "https://apps.apple.com/app/oliva/id123456789",
        "inLanguage": "en",
        "actionPlatform": [
          "https://schema.org/iOS",
          "https://schema.org/Android"
        ]
      }
    ]
  }
}
</script>
```

### Medical procedure tracking

```typescript
// Structured data for medical records
const medicalRecordSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  "name": "Intermittent Catheterization",
  "procedureType": {
    "@type": "MedicalTherapy",
    "name": "Bladder Management"
  },
  "bodyLocation": {
    "@type": "AnatomicalStructure",
    "name": "Urinary Bladder"
  },
  "status": "active",
  "performedBy": {
    "@type": "MedicalOrganization",
    "name": "Patient/Caregiver"
  }
};
```

## Core Web Vitals optimization

### Performance metrics

```typescript
// src/utils/performance.ts
import { PerformanceObserver } from 'perf_hooks';

- **Performance**: User experience directly impacts ratings
- **Compliance**: Modern web standards expectation

Trade-off: Additional performance monitoring complexity.

### Why comprehensive ASO strategy?

- **Visibility**: Medical apps have specific search patterns
- **Competition**: Healthcare category is crowded
- **Trust**: Proper medical terminology builds credibility

Trade-off: Keyword stuffing can hurt rankings.

### Why image optimization?

- **Bundle size**: Medical apps need efficient asset loading
- **Storage**: Limited device storage for health records
- **Performance**: Faster image display improves UX

Trade-off: Image quality vs file size balance.
