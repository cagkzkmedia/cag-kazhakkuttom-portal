#!/bin/bash

# Deployment Script for Case-Insensitive Username Feature
# This script deploys the Firestore index and runs the migration

echo "======================================"
echo "Case-Insensitive Username Deployment"
echo "======================================"
echo ""

# Step 1: Deploy Firestore indexes
echo "Step 1: Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy Firestore indexes"
    exit 1
fi

echo "✅ Firestore indexes deployed successfully"
echo ""

# Step 2: Wait for user confirmation
echo "⏳ Please wait for the Firestore index to build (usually 1-2 minutes)"
echo "   Check Firebase Console → Firestore → Indexes"
echo ""
read -p "Press Enter when the index status shows 'Enabled'..."
echo ""

# Step 3: Run migration script
echo "Step 2: Running migration script..."
node src/scripts/migrateUsernameLowerCase.js

if [ $? -ne 0 ]; then
    echo "❌ Migration script failed"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ Deployment completed successfully!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Test login with different username cases"
echo "2. Verify all existing members can login"
echo "3. Monitor for any issues"
echo ""
