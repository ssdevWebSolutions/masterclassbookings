import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, CheckCircle, Info, X, Award, Target, TrendingUp, AlertCircle } from 'lucide-react';

const CricketAcademyBooking = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Block 1 dates with availability status
  const block1Dates = [
    // Fridays 5:45pm-7:15pm
    { date: '2024-10-11', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'filling-fast', spots: 3 },
    { date: '2024-10-18', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'available', spots: 8 },
    { date: '2024-10-25', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'filling-fast', spots: 2 },
    { date: '2024-11-01', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'available', spots: 6 },
    { date: '2024-11-08', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'not-available', spots: 0 },
    { date: '2024-11-15', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'available', spots: 7 },
    { date: '2024-11-22', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'filling-fast', spots: 1 },
    { date: '2024-11-29', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'available', spots: 5 },
    { date: '2024-12-06', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'filling-fast', spots: 2 },
    { date: '2024-12-13', day: 'Friday', time: '5:45pm-7:15pm', type: 'friday', availability: 'available', spots: 4 },
    
    // Sundays - Class 1: 4:30-6pm, Class 2: 6-7:30pm
    { date: '2024-10-13', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'available', spots: 6 },
    { date: '2024-10-13', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'filling-fast', spots: 2 },
    { date: '2024-10-20', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'filling-fast', spots: 3 },
    { date: '2024-10-20', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'not-available', spots: 0 },
    { date: '2024-10-27', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'available', spots: 8 },
    { date: '2024-10-27', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'available', spots: 7 },
    { date: '2024-11-03', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'filling-fast', spots: 1 },
    { date: '2024-11-03', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'available', spots: 5 },
    { date: '2024-11-10', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'available', spots: 9 },
    { date: '2024-11-10', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'filling-fast', spots: 2 },
    { date: '2024-11-17', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'not-available', spots: 0 },
    { date: '2024-11-17', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'available', spots: 6 },
    { date: '2024-11-24', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'available', spots: 7 },
    { date: '2024-11-24', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'filling-fast', spots: 3 },
    { date: '2024-12-01', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'available', spots: 8 },
    { date: '2024-12-01', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'available', spots: 4 },
    { date: '2024-12-08', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'filling-fast', spots: 1 },
    { date: '2024-12-08', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'available', spots: 5 },
    { date: '2024-12-15', day: 'Sunday', time: '4:30pm-6:00pm', type: 'sunday-class1', class: 'Class 1', availability: 'available', spots: 6 },
    { date: '2024-12-15', day: 'Sunday', time: '6:00pm-7:30pm', type: 'sunday-class2', class: 'Class 2', availability: 'filling-fast', spots: 2 },
  ];

  const toggleDateSelection = (dateKey, availability) => {
    if (availability === 'not-available') return;
    
    setSelectedDates(prev => 
      prev.includes(dateKey) 
        ? prev.filter(d => d !== dateKey)
        : [...prev, dateKey]
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getAvailabilityBadge = (availability, spots) => {
    switch (availability) {
      case 'available':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Available ({spots} spots)
          </span>
        );
      case 'filling-fast':
        return (
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
            Filling Fast ({spots} left)
          </span>
        );
      case 'not-available':
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Sold Out
          </span>
        );
      default:
        return null;
    }
  };

  const totalCost = selectedDates.length * 40;
  const discountAmount = selectedDates.length === 10 ? 50 : 0;
  const finalCost = totalCost - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <Award className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Masterclass Cricket Academy
          </h1>
          <p className="text-xl text-gray-600 mb-8">Block 1: Technical Development Programme</p>
          
          {/* Availability Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Sessions filling up quickly</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Venue Information */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Venue</h3>
          </div>
          <p className="text-gray-700 ml-8">Tiffin Girls School, KT2 5PL</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Programme Details</h3>
              <p className="text-gray-600">Technical analysis, skills development & conditioning</p>
            </div>
            <button 
              onClick={() => setShowDescription(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Info className="w-4 h-4" />
              Read More
            </button>
          </div>
        </div>

        {/* Child Selection */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Child</h3>
          <div className="flex gap-3 flex-wrap">
            <select 
              className="flex-1 min-w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              <option value="">Choose child</option>
              <option value="child1">Child 1</option>
              <option value="child2">Child 2</option>
            </select>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-3 rounded-lg font-medium transition-colors">
              Add New Child
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Per Session</p>
              <p className="text-3xl font-bold text-gray-900">£40</p>
            </div>
            <div className="border-2 border-yellow-400 rounded-lg p-4 text-center relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-medium">
                  Best Value
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 mt-2">Full Block (10 sessions)</p>
              <p className="text-3xl font-bold text-gray-900">£350</p>
              <p className="text-sm text-green-600 font-medium">Save £50</p>
            </div>
          </div>
        </div>

        {/* Calendar Selection */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Select Sessions</h3>
            </div>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {showCalendar ? 'Hide Sessions' : 'View Sessions'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Friday Sessions
              </h4>
              <p className="text-gray-700">5:45pm - 7:15pm</p>
              <p className="text-sm text-gray-600">Oct 10 - Dec 13</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Sunday Sessions
              </h4>
              <p className="text-gray-700">Class 1: 4:30pm - 6:00pm</p>
              <p className="text-gray-700">Class 2: 6:00pm - 7:30pm</p>
              <p className="text-sm text-gray-600">Oct 13 - Dec 15</p>
            </div>
          </div>

          {showCalendar && (
            <div className="border-t pt-6 space-y-3">
              <h4 className="font-medium text-gray-900 mb-4">Available Sessions</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {block1Dates.map((session, index) => {
                  const dateKey = `${session.date}-${session.time}-${session.class || ''}`;
                  const isSelected = selectedDates.includes(dateKey);
                  const isDisabled = session.availability === 'not-available';
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => toggleDateSelection(dateKey, session.availability)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isDisabled 
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          : isSelected 
                            ? 'border-yellow-400 bg-yellow-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {formatDate(session.date)}
                            {session.class && ` - ${session.class}`}
                          </p>
                          <p className="text-gray-600 text-sm">{session.time}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getAvailabilityBadge(session.availability, session.spots)}
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'border-yellow-500 bg-yellow-500' 
                              : isDisabled 
                                ? 'border-gray-300'
                                : 'border-gray-400'
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="terms" 
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-yellow-500 bg-white border-gray-300 rounded focus:ring-yellow-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
              I accept the <a href="#" className="text-gray-900 font-medium underline">Terms and Conditions</a> and confirm all information is accurate.
            </label>
          </div>
        </div>

        {/* Total and Confirm */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total</h3>
              <p className="text-gray-600">{selectedDates.length} session{selectedDates.length !== 1 ? 's' : ''} selected</p>
            </div>
            <div className="text-right">
              {discountAmount > 0 && (
                <p className="text-lg text-gray-500 line-through">£{totalCost}</p>
              )}
              <p className="text-2xl font-bold text-gray-900">£{finalCost}</p>
              {discountAmount > 0 && (
                <p className="text-sm text-green-600">You save £{discountAmount}</p>
              )}
            </div>
          </div>
          
          <button 
            disabled={selectedDates.length === 0 || !selectedChild || !acceptTerms}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              selectedDates.length > 0 && selectedChild && acceptTerms
                ? 'bg-gray-900 hover:bg-gray-800 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Booking - £{finalCost}
          </button>
        </div>
      </div>

      {/* Description Modal */}
      {showDescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Block 1: Technical Development</h3>
              <button 
                onClick={() => setShowDescription(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Batting Excellence
                  </h4>
                  <p className="text-gray-700 text-sm">Technical analysis using video feedback, stance correction, shot selection, and timing drills.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Bowling Development
                  </h4>
                  <p className="text-gray-700 text-sm">Comprehensive technique analysis, run-up optimization, accuracy training, and variation development.</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Fielding & Conditioning
                  </h4>
                  <p className="text-gray-700 text-sm">Dynamic fielding drills, catching techniques, and cricket-specific fitness training.</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Programme Includes:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Individual technical assessment</li>
                  <li>• Video analysis and feedback</li>
                  <li>• Professional qualified coaching</li>
                  <li>• Small group sessions (max 12 players)</li>
                  <li>• Progress tracking reports</li>
                  <li>• Premium equipment access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CricketAcademyBooking;