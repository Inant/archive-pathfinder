
import React, { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Building, Map, Activity, ImageIcon, Plus, Pencil, Trash2, Save, X 
} from 'lucide-react';

// Mock accommodations data
const initialAccommodations = [
  { id: 1, name: 'Grand Luxury Resort', type: 'Hotel', location: 'Mount Bromo', rooms: 120 },
  { id: 2, name: 'Volcano View Villas', type: 'Villa', location: 'Mount Merapi', rooms: 45 },
  { id: 3, name: 'Crater Edge Hostel', type: 'Hostel', location: 'Mount Batur', rooms: 75 },
];

// Mock destinations data
const initialDestinations = [
  { id: 1, name: 'Mount Bromo', description: 'Active volcano with stunning sunrise views', elevation: '2,329m' },
  { id: 2, name: 'Mount Merapi', description: 'Most active volcano in Indonesia', elevation: '2,911m' },
  { id: 3, name: 'Mount Batur', description: 'Popular hiking destination with lake views', elevation: '1,717m' },
];

// Mock activities data
const initialActivities = [
  { id: 1, name: 'Bromo Sunrise Tour', duration: '4 hours', price: '$45' },
  { id: 2, name: 'Merapi Lava Tour', duration: '3 hours', price: '$65' },
  { id: 3, name: 'Batur Breakfast Hike', duration: '6 hours', price: '$55' },
];

// Mock assets data
const initialAssets = [
  { id: 1, name: 'JVTO Logo', type: 'Image', path: '/assets/jvto-logo.png' },
  { id: 2, name: 'Tour Brochure', type: 'PDF', path: '/assets/brochure.pdf' },
  { id: 3, name: 'Welcome Banner', type: 'Image', path: '/assets/banner.jpg' },
];

const SharedResourcesPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState(initialAccommodations);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [activities, setActivities] = useState(initialActivities);
  const [assets, setAssets] = useState(initialAssets);
  
  const [editingAccommodation, setEditingAccommodation] = useState<number | null>(null);
  const [editingDestination, setEditingDestination] = useState<number | null>(null);
  const [editingActivity, setEditingActivity] = useState<number | null>(null);
  const [editingAsset, setEditingAsset] = useState<number | null>(null);
  
  const [newAccommodation, setNewAccommodation] = useState({ name: '', type: '', location: '', rooms: '' });
  const [newDestination, setNewDestination] = useState({ name: '', description: '', elevation: '' });
  const [newActivity, setNewActivity] = useState({ name: '', duration: '', price: '' });
  const [newAsset, setNewAsset] = useState({ name: '', type: '', path: '' });
  
  // Form handlers for Accommodations
  const handleAddAccommodation = () => {
    if (!newAccommodation.name || !newAccommodation.type) return;
    
    setAccommodations([
      ...accommodations, 
      { 
        id: accommodations.length + 1, 
        name: newAccommodation.name, 
        type: newAccommodation.type, 
        location: newAccommodation.location, 
        rooms: parseInt(newAccommodation.rooms) || 0 
      }
    ]);
    setNewAccommodation({ name: '', type: '', location: '', rooms: '' });
  };
  
  const handleDeleteAccommodation = (id: number) => {
    setAccommodations(accommodations.filter(acc => acc.id !== id));
  };
  
  const handleSaveAccommodation = (id: number, data: any) => {
    setAccommodations(accommodations.map(acc => 
      acc.id === id ? { ...acc, ...data } : acc
    ));
    setEditingAccommodation(null);
  };
  
  // Form handlers for Destinations
  const handleAddDestination = () => {
    if (!newDestination.name) return;
    
    setDestinations([
      ...destinations, 
      { 
        id: destinations.length + 1, 
        name: newDestination.name, 
        description: newDestination.description, 
        elevation: newDestination.elevation 
      }
    ]);
    setNewDestination({ name: '', description: '', elevation: '' });
  };
  
  const handleDeleteDestination = (id: number) => {
    setDestinations(destinations.filter(dest => dest.id !== id));
  };
  
  const handleSaveDestination = (id: number, data: any) => {
    setDestinations(destinations.map(dest => 
      dest.id === id ? { ...dest, ...data } : dest
    ));
    setEditingDestination(null);
  };
  
  // Form handlers for Activities
  const handleAddActivity = () => {
    if (!newActivity.name) return;
    
    setActivities([
      ...activities, 
      { 
        id: activities.length + 1, 
        name: newActivity.name, 
        duration: newActivity.duration, 
        price: newActivity.price 
      }
    ]);
    setNewActivity({ name: '', duration: '', price: '' });
  };
  
  const handleDeleteActivity = (id: number) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };
  
  const handleSaveActivity = (id: number, data: any) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, ...data } : activity
    ));
    setEditingActivity(null);
  };
  
  // Form handlers for Assets
  const handleAddAsset = () => {
    if (!newAsset.name || !newAsset.type) return;
    
    setAssets([
      ...assets, 
      { 
        id: assets.length + 1, 
        name: newAsset.name, 
        type: newAsset.type, 
        path: newAsset.path 
      }
    ]);
    setNewAsset({ name: '', type: '', path: '' });
  };
  
  const handleDeleteAsset = (id: number) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };
  
  const handleSaveAsset = (id: number, data: any) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, ...data } : asset
    ));
    setEditingAsset(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainNavigation />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Shared Resources</h1>
          <p className="text-gray-600">Manage accommodations, destinations, activities, and digital assets</p>
        </div>

        <Tabs defaultValue="accommodations">
          <TabsList className="mb-6 w-full bg-white p-1 border border-gray-200 rounded-lg">
            <TabsTrigger value="accommodations" className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Accommodations
            </TabsTrigger>
            <TabsTrigger value="destinations" className="flex items-center">
              <Map className="w-4 h-4 mr-2" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Assets
            </TabsTrigger>
          </TabsList>

          {/* Accommodations Tab */}
          <TabsContent value="accommodations">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-800">Accommodations</h2>
                <button
                  onClick={() => document.getElementById('accommodationForm')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Accommodation
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accommodations.map((accommodation) => (
                      <tr key={accommodation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingAccommodation === accommodation.id ? (
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={accommodation.name}
                              onChange={(e) => setAccommodations(accommodations.map(acc => 
                                acc.id === accommodation.id ? { ...acc, name: e.target.value } : acc
                              ))}
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{accommodation.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingAccommodation === accommodation.id ? (
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={accommodation.type}
                              onChange={(e) => setAccommodations(accommodations.map(acc => 
                                acc.id === accommodation.id ? { ...acc, type: e.target.value } : acc
                              ))}
                            />
                          ) : (
                            <div className="text-sm text-gray-500">{accommodation.type}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingAccommodation === accommodation.id ? (
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={accommodation.location}
                              onChange={(e) => setAccommodations(accommodations.map(acc => 
                                acc.id === accommodation.id ? { ...acc, location: e.target.value } : acc
                              ))}
                            />
                          ) : (
                            <div className="text-sm text-gray-500">{accommodation.location}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingAccommodation === accommodation.id ? (
                            <input 
                              type="number" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={accommodation.rooms}
                              onChange={(e) => setAccommodations(accommodations.map(acc => 
                                acc.id === accommodation.id ? { ...acc, rooms: parseInt(e.target.value) || 0 } : acc
                              ))}
                            />
                          ) : (
                            <div className="text-sm text-gray-500">{accommodation.rooms}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingAccommodation === accommodation.id ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleSaveAccommodation(accommodation.id, accommodation)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingAccommodation(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setEditingAccommodation(accommodation.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAccommodation(accommodation.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div id="accommodationForm" className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Accommodation</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAccommodation.name}
                      onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAccommodation.type}
                      onChange={(e) => setNewAccommodation({ ...newAccommodation, type: e.target.value })}
                    >
                      <option value="">Select type</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Villa">Villa</option>
                      <option value="Hostel">Hostel</option>
                      <option value="Resort">Resort</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAccommodation.location}
                      onChange={(e) => setNewAccommodation({ ...newAccommodation, location: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Rooms</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAccommodation.rooms}
                      onChange={(e) => setNewAccommodation({ ...newAccommodation, rooms: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleAddAccommodation}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Accommodation
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinations">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-800">Destinations</h2>
                <button
                  onClick={() => document.getElementById('destinationForm')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination) => (
                  <div key={destination.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      {editingDestination === destination.id ? (
                        <input 
                          type="text" 
                          className="border border-gray-300 rounded-md px-2 py-1 w-full font-medium"
                          defaultValue={destination.name}
                          onChange={(e) => setDestinations(destinations.map(dest => 
                            dest.id === destination.id ? { ...dest, name: e.target.value } : dest
                          ))}
                        />
                      ) : (
                        <h3 className="text-lg font-medium text-gray-900">{destination.name}</h3>
                      )}
                    </div>
                    <div className="p-4">
                      {editingDestination === destination.id ? (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={destination.description}
                              rows={3}
                              onChange={(e) => setDestinations(destinations.map(dest => 
                                dest.id === destination.id ? { ...dest, description: e.target.value } : dest
                              ))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Elevation</label>
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={destination.elevation}
                              onChange={(e) => setDestinations(destinations.map(dest => 
                                dest.id === destination.id ? { ...dest, elevation: e.target.value } : dest
                              ))}
                            />
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <button 
                              onClick={() => handleSaveDestination(destination.id, destination)}
                              className="flex items-center text-sm px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingDestination(null)}
                              className="flex items-center text-sm px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-600 mb-4">{destination.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Elevation: {destination.elevation}</span>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setEditingDestination(destination.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDestination(destination.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div id="destinationForm" className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Destination</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newDestination.name}
                      onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newDestination.description}
                      onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Elevation</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newDestination.elevation}
                      onChange={(e) => setNewDestination({ ...newDestination, elevation: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleAddDestination}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Destination
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-800">Activities</h2>
                <button
                  onClick={() => document.getElementById('activityForm')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr key={activity.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingActivity === activity.id ? (
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={activity.name}
                              onChange={(e) => setActivities(activities.map(act => 
                                act.id === activity.id ? { ...act, name: e.target.value } : act
                              ))}
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingActivity === activity.id ? (
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={activity.duration}
                              onChange={(e) => setActivities(activities.map(act => 
                                act.id === activity.id ? { ...act, duration: e.target.value } : act
                              ))}
                            />
                          ) : (
                            <div className="text-sm text-gray-500">{activity.duration}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingActivity === activity.id ? (
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={activity.price}
                              onChange={(e) => setActivities(activities.map(act => 
                                act.id === activity.id ? { ...act, price: e.target.value } : act
                              ))}
                            />
                          ) : (
                            <div className="text-sm text-gray-500">{activity.price}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingActivity === activity.id ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleSaveActivity(activity.id, activity)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingActivity(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setEditingActivity(activity.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div id="activityForm" className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Activity</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newActivity.name}
                      onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newActivity.price}
                      onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleAddActivity}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-800">Assets</h2>
                <button
                  onClick={() => document.getElementById('assetForm')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                  <div key={asset.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      {editingAsset === asset.id ? (
                        <input 
                          type="text" 
                          className="border border-gray-300 rounded-md px-2 py-1 w-full font-medium"
                          defaultValue={asset.name}
                          onChange={(e) => setAssets(assets.map(a => 
                            a.id === asset.id ? { ...a, name: e.target.value } : a
                          ))}
                        />
                      ) : (
                        <h3 className="text-lg font-medium text-gray-900">{asset.name}</h3>
                      )}
                    </div>
                    <div className="p-4">
                      {editingAsset === asset.id ? (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={asset.type}
                              onChange={(e) => setAssets(assets.map(a => 
                                a.id === asset.id ? { ...a, type: e.target.value } : a
                              ))}
                            >
                              <option value="Image">Image</option>
                              <option value="PDF">PDF</option>
                              <option value="Video">Video</option>
                              <option value="Document">Document</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
                            <input 
                              type="text" 
                              className="border border-gray-300 rounded-md px-2 py-1 w-full"
                              defaultValue={asset.path}
                              onChange={(e) => setAssets(assets.map(a => 
                                a.id === asset.id ? { ...a, path: e.target.value } : a
                              ))}
                            />
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <button 
                              onClick={() => handleSaveAsset(asset.id, asset)}
                              className="flex items-center text-sm px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingAsset(null)}
                              className="flex items-center text-sm px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center mb-4">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{asset.type}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 font-mono">{asset.path}</p>
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => setEditingAsset(asset.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div id="assetForm" className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Asset</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAsset.type}
                      onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                    >
                      <option value="">Select type</option>
                      <option value="Image">Image</option>
                      <option value="PDF">PDF</option>
                      <option value="Video">Video</option>
                      <option value="Document">Document</option>
                    </select>
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Path</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newAsset.path}
                      onChange={(e) => setNewAsset({ ...newAsset, path: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleAddAsset}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-white border-t border-gray-100 py-3 px-6 text-center text-sm text-gray-500">
        <p>Java Volcano Tour Operator - Archive Pathfinder © 2025</p>
      </footer>
    </div>
  );
};

export default SharedResourcesPage;
