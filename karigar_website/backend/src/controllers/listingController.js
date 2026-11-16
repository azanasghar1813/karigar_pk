const mongoose = require('mongoose');
const Listing = require('../models/Listing');

// Public fields whitelist: guarantees internal notes and sensitive administrative flags are never leaked
const PUBLIC_LISTING_FIELDS = '_id name service city area address phone whatsapp rating source sourceUrl coordinates photos claimStatus claimedBy isActive createdAt updatedAt';

/**
 * @desc    Get all directory listings with filtering, search, pagination
 * @route   GET /api/listings
 * @access  Public
 */
const getListings = async (req, res) => {
  try {
    const { city, area, service, q, verifiedOnly } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 24));
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    // City Filter
    if (city && city !== 'All' && city !== 'All Cities' && city !== 'Your City') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    // Area Filter
    if (area && area !== 'All' && area !== 'All Areas') {
      query.area = new RegExp(area.trim(), 'i');
    }

    // Service Category Filter
    if (service && service !== 'All' && service !== 'All Categories') {
      query.service = new RegExp(service.trim(), 'i');
    }

    // Verified Only Filter
    if (verifiedOnly === 'true' || verifiedOnly === '1' || verifiedOnly === true) {
      query.claimStatus = 'verified';
    }

    // Search query (name, service, or area)
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { service: searchRegex },
        { area: searchRegex },
        { address: searchRegex }
      ];
    }

    const [total, listings] = await Promise.all([
      Listing.countDocuments(query),
      Listing.find(query)
        .select(PUBLIC_LISTING_FIELDS)
        .sort({ rating: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    res.json({
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    });
  } catch (error) {
    console.error('Error in getListings:', error);
    res.status(500).json({ message: 'Failed to retrieve directory listings' });
  }
};

/**
 * @desc    Get areas with real listing counts per area and breakdown per service
 * @route   GET /api/listings/areas
 * @access  Public
 */
const getAreasWithCounts = async (req, res) => {
  try {
    const { city } = req.query;
    const match = { isActive: true };

    if (city && city !== 'All' && city !== 'All Cities' && city !== 'Your City') {
      match.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    const areaAggregation = await Listing.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            area: { $ifNull: ['$area', 'General'] },
            service: '$service'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.area',
          totalCount: { $sum: '$count' },
          services: {
            $push: {
              service: '$_id.service',
              count: '$count'
            }
          }
        }
      },
      { $sort: { totalCount: -1 } },
      {
        $project: {
          _id: 0,
          area: '$_id',
          totalCount: 1,
          services: 1
        }
      }
    ]);

    res.json({
      city: city || 'All Cities',
      totalAreas: areaAggregation.length,
      areas: areaAggregation
    });
  } catch (error) {
    console.error('Error in getAreasWithCounts:', error);
    res.status(500).json({ message: 'Failed to retrieve areas count' });
  }
};

/**
 * @desc    Get single listing details
 * @route   GET /api/listings/:id
 * @access  Public
 */
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Directory listing not found' });
    }

    const listing = await Listing.findOne({ _id: id, isActive: true })
      .select(PUBLIC_LISTING_FIELDS)
      .lean();

    if (!listing) {
      return res.status(404).json({ message: 'Directory listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Error in getListingById:', error);
    res.status(500).json({ message: 'Failed to retrieve listing details' });
  }
};

module.exports = {
  getListings,
  getAreasWithCounts,
  getListingById
};
