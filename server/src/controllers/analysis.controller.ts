import { Request, Response } from "express"

export const analyzeIpAddress = async (req: Request, res: Response) => {
  try {
    const { ip } = req.params
    if (!ip) {
      return res.status(400).json({ error: "IP address is required" })
    }

    // ip-api.com endpoint. Note: The free tier allows 45 requests per minute.
    const url = `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query,proxy,hosting`
    
    const response = await fetch(url)
    let data = await response.json()

    // Handle private/reserved IPs gracefully
    if (data.status !== "success") {
      if (data.message === "private range" || data.message === "reserved range") {
        data = {
          query: ip,
          country: "Local Network",
          regionName: "Private",
          city: "Local",
          lat: 0,
          lon: 0,
          timezone: "Local",
          isp: "Private Network",
          org: "Local",
          proxy: false,
          hosting: false
        }
      } else {
        return res.status(400).json({ error: data.message || "Failed to analyze IP" })
      }
    }

    // Determine category
    const isPrivate = ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.") || ip.startsWith("127.")
    
    // Build the analysis object to match what the frontend expects
    const analysis = {
      ip: data.query,
      type: data.query.includes(":") ? "IPv6" : "IPv4",
      status: "Valid",
      category: isPrivate ? "Private" : "Public",
      location: {
        country: data.country || "Unknown",
        region: data.regionName || "Unknown",
        city: data.city || "Unknown",
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        timezone: data.timezone || "Unknown",
        isp: data.isp || "Unknown",
        organization: data.org || "Unknown",
        postal: data.zip || "Unknown",
      },
      security: {
        threat: data.proxy || data.hosting ? "Suspicious" : "Clean",
        blacklisted: false, // Would require a separate threat intel API
        proxy: !!data.proxy,
        vpn: !!data.hosting, // Assuming hosting means VPN/Datacenter traffic
        tor: false, // Tor detection would need another service
        reputation: data.proxy || data.hosting ? 40 : 95,
      },
      network: {
        asn: data.as || "Unknown",
        domain: data.org || "Unknown",
        usage: data.hosting ? "hosting" : "residential",
      },
    }

    return res.json(analysis)
  } catch (error) {
    console.error("Error analyzing IP:", error)
    return res.status(500).json({ error: "Internal server error analyzing IP" })
  }
}
