/**
 * TheraBrake Academy - Stripe Product Catalog Bulk Upload
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

interface ProductData {
  name: string
  description: string
  price: number
  billingPeriod?: 'year' | 'month' | null
  metadata: Record<string, string>
  category: string
  memberPrice?: number
}

const PRODUCT_CATALOG: ProductData[] = [
  {
    name: '1-Year CE Membership',
    description: 'Access to ALL Professional Development & CEU Courses. 31+ CE credit hours included.',
    price: 199.00,
    billingPeriod: 'year',
    metadata: {
      product_id: 'ce_1_year',
      product_type: 'membership',
      ce_hours: '31',
      access_duration_months: '12',
      category: 'ce_membership'
    },
    category: 'CE Membership'
  },
  {
    name: '2-Year CE Membership',
    description: 'Access to ALL Professional Development & CEU Courses for 24 months. $100 discount on premium programs.',
    price: 299.00,
    billingPeriod: 'year',
    metadata: {
      product_id: 'ce_2_year',
      product_type: 'membership',
      ce_hours: '31+',
      access_duration_months: '24',
      category: 'ce_membership',
      premium_discount: '100'
    },
    category: 'CE Membership'
  },
  {
    name: '5-Year CE Membership',
    description: 'Complete Professional & Personal Development Access. 200+ CE credit hours.',
    price: 699.00,
    billingPeriod: 'year',
    metadata: {
      product_id: 'ce_5_year',
      product_type: 'membership',
      ce_hours: '200+',
      access_duration_months: '60',
      category: 'ce_membership',
      includes_personal_dev: 'true'
    },
    category: 'CE Membership'
  },
  {
    name: 'The So What Mindset',
    description: 'Transformational Thinking and Resilience Training. 6-month access.',
    price: 499.00,
    billingPeriod: null,
    memberPrice: 399.00,
    metadata: {
      product_id: 'so_what_mindset',
      product_type: 'premium_program',
      access_duration_months: '6',
      category: 'premium_program',
      member_discount_price: '399'
    },
    category: 'Premium Program'
  },
  {
    name: 'Leap & Launch!',
    description: 'Flagship Business Development Program. 6-month access.',
    price: 299.00,
    billingPeriod: null,
    memberPrice: 199.00,
    metadata: {
      product_id: 'leap_launch',
      product_type: 'premium_program',
      access_duration_months: '6',
      category: 'premium_program',
      member_discount_price: '199'
    },
    category: 'Premium Program'
  },
  {
    name: 'Building a Trauma-Informed Practice & Telehealth',
    description: '6 CE Hours - Transform Your Practice for the Modern Era.',
    price: 59.99,
    billingPeriod: null,
    metadata: {
      product_id: 'course_trauma_informed',
      product_type: 'course',
      ce_hours: '6',
      category: 'ce_course',
      access_duration_months: '6'
    },
    category: 'CE Course'
  },
]

async function uploadProducts() {
  console.log('🧠 ==========================================')
  console.log('🧠 TheraBrake Academy - Stripe Product Upload')
  console.log('🧠 ==========================================\n')

  const results = {
    created: [] as string[],
    failed: [] as { name: string; error: string }[],
    priceIds: {} as Record<string, string>
  }

  for (const product of PRODUCT_CATALOG) {
    try {
      console.log(`📦 Creating: ${product.name}...`)

      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: product.metadata
      })

      console.log(`   ✅ Product created: ${stripeProduct.id}`)

      const priceData: Stripe.PriceCreateParams = {
        product: stripeProduct.id,
        currency: 'usd',
        unit_amount: Math.round(product.price * 100),
      }

      if (product.billingPeriod) {
        priceData.recurring = {
          interval: product.billingPeriod,
          interval_count: 1
        }
      }

      const price = await stripe.prices.create(priceData)
      console.log(`   ✅ Price created: ${price.id}`)

      results.priceIds[product.metadata.product_id] = price.id

      if (product.memberPrice) {
        const memberPrice = await stripe.prices.create({
          product: stripeProduct.id,
          currency: 'usd',
          unit_amount: Math.round(product.memberPrice * 100),
          metadata: {
            price_type: 'member_discount',
            requires_membership: 'true'
          }
        })
        console.log(`   ✅ Member price created: ${memberPrice.id}`)
        results.priceIds[`${product.metadata.product_id}_member`] = memberPrice.id
      }

      results.created.push(product.name)
      console.log(`   ✅ Complete!\n`)

    } catch (error: any) {
      console.log(`   ❌ Failed: ${error.message}\n`)
      results.failed.push({
        name: product.name,
        error: error.message
      })
    }
  }

  console.log('\n🎉 ==========================================')
  console.log('🎉 Upload Complete!')
  console.log('🎉 ==========================================\n')
  console.log(`✅ Successfully created: ${results.created.length}`)
  console.log(`❌ Failed: ${results.failed.length}\n`)

  if (results.failed.length > 0) {
    console.log('Failed products:')
    results.failed.forEach(f => {
      console.log(`  - ${f.name}: ${f.error}`)
    })
    console.log('')
  }

  console.log('📋 Price IDs for .env.local:')
  console.log('==========================================\n')
  
  Object.entries(results.priceIds).forEach(([key, value]) => {
    const envVar = `STRIPE_PRICE_${key.toUpperCase()}`
    console.log(`${envVar}=${value}`)
  })

  const fs = require('fs')
  const envContent = Object.entries(results.priceIds)
    .map(([key, value]) => {
      const envVar = `STRIPE_PRICE_${key.toUpperCase()}`
      return `${envVar}=${value}`
    })
    .join('\n')

  fs.writeFileSync('.env.stripe.generated', envContent)
  console.log('\n✅ Price IDs saved to .env.stripe.generated')
  console.log('   Copy these to your .env.local file\n')
}

uploadProducts()
  .then(() => {
    console.log('🎊 All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
