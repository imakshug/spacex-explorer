import type { SpaceXLaunch, SpaceXRocket } from '../types/spacex';

const BASE_URL = 'https://api.spacexdata.com/v4';

export class SpaceXAPI {
  // Fetch all launches with optional query parameters
  static async getLaunches(options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<SpaceXLaunch[]> {
    const params = new URLSearchParams();
    
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.sort) params.append('sort', options.sort);
    if (options?.order) params.append('order', options.order);

    const url = `${BASE_URL}/launches${params.toString() ? `?${params.toString()}` : ''}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching launches:', error);
      throw error;
    }
  }

  // Fetch latest launch
  static async getLatestLaunch(): Promise<SpaceXLaunch> {
    try {
      const response = await fetch(`${BASE_URL}/launches/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest launch:', error);
      throw error;
    }
  }

  // Fetch upcoming launches
  static async getUpcomingLaunches(): Promise<SpaceXLaunch[]> {
    try {
      const response = await fetch(`${BASE_URL}/launches/upcoming`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming launches:', error);
      throw error;
    }
  }

  // Search launches by name
  static async searchLaunches(query: string): Promise<SpaceXLaunch[]> {
    try {
      const response = await fetch(`${BASE_URL}/launches/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            name: {
              $regex: query,
              $options: 'i'
            }
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('Error searching launches:', error);
      throw error;
    }
  }

  // Fetch rockets
  static async getRockets(): Promise<SpaceXRocket[]> {
    try {
      const response = await fetch(`${BASE_URL}/rockets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching rockets:', error);
      throw error;
    }
  }

  // Fetch rocket by ID
  static async getRocketById(id: string): Promise<SpaceXRocket> {
    try {
      const response = await fetch(`${BASE_URL}/rockets/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching rocket:', error);
      throw error;
    }
  }
}