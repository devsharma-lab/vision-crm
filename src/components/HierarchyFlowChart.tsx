import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface HierarchyFlowChartProps {
  allUsers: UserProfile[];
  onUserClick: (user: UserProfile) => void;
  calculateMetrics: (user?: UserProfile) => any;
}

interface TreeNode extends d3.HierarchyNode<UserProfile> {
  x0?: number;
  y0?: number;
  _children?: TreeNode[];
}

export function HierarchyFlowChart({ allUsers, onUserClick, calculateMetrics }: HierarchyFlowChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || allUsers.length === 0) return;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1000;
    const height = 700;
    const margin = { top: 80, right: 30, bottom: 30, left: 30 };
    const nodeWidth = 140;
    const nodeHeight = 70;
    const verticalGap = 100;
    const horizontalGap = 180;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "auto") // Responsive height
      .style("font", "12px sans-serif")
      .style("background-color", "#f8fafc");

    const g = svg.append("g");

    // Find the root (Admin)
    const rootUser = allUsers.find(u => u.role === 'ADMIN') || allUsers[0];
    const root = d3.hierarchy(rootUser, d => allUsers.filter(u => u.parentUid === d.uid)) as TreeNode;

    // Custom Layout Logic
    // Level 0: Root (Centered)
    root.x = width / 2;
    root.y = margin.top;

    const level1Nodes = root.children || [];
    const totalLevel1 = level1Nodes.length;
    const level1StartX = (width - (totalLevel1 - 1) * horizontalGap) / 2;

    level1Nodes.forEach((d, i) => {
      d.x = level1StartX + i * horizontalGap;
      d.y = root.y + 160;

      // Stack descendants vertically
      let currentY = d.y + verticalGap;
      const stackDescendants = (node: d3.HierarchyNode<UserProfile>) => {
        if (!node.children) return;
        node.children.forEach(child => {
          child.x = d.x; // Keep same X as Level 1 parent
          child.y = currentY;
          currentY += verticalGap;
          stackDescendants(child);
        });
      };
      stackDescendants(d);
    });

    const nodes = root.descendants();
    const links = root.links();

    // Draw Links (Step style like the image)
    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("d", (d: any) => {
        const s = d.source;
        const t = d.target;
        
        if (s.depth === 0) {
          // Root to Level 1: Horizontal then Vertical
          return `M ${s.x} ${s.y + nodeHeight/2}
                  V ${s.y + 70}
                  H ${t.x}
                  V ${t.y - nodeHeight/2}`;
        } else {
          // Level 1+ : Vertical step on the left
          const lineX = s.x - nodeWidth/2 - 20;
          return `M ${s.x - nodeWidth/2} ${s.y}
                  H ${lineX}
                  V ${t.y}
                  H ${t.x - nodeWidth/2}`;
        }
      });

    // Draw Nodes
    const node = g.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("cursor", "pointer")
      .on("click", function(event, d) {
        // Click animation
        d3.select(this)
          .transition()
          .duration(100)
          .attr("transform", `translate(${d.x},${d.y}) scale(0.95)`)
          .transition()
          .duration(100)
          .attr("transform", `translate(${d.x},${d.y}) scale(1)`);
          
        onUserClick(d.data);
      })
      .on("mouseover", function() {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("stroke", "#3b82f6")
          .attr("stroke-width", 3)
          .style("filter", "drop-shadow(0 12px 20px rgba(59, 130, 246, 0.3))");
          
        d3.select(this).select(".click-hint")
          .transition()
          .duration(200)
          .attr("fill-opacity", 1)
          .attr("transform", "translate(0, 5)");
      })
      .on("mouseout", function(event, d: any) {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("stroke", d.depth === 0 ? "#475569" : "none")
          .attr("stroke-width", 2)
          .style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))");
          
        d3.select(this).select(".click-hint")
          .transition()
          .duration(200)
          .attr("fill-opacity", 0.7)
          .attr("transform", "translate(0, 0)");
      });

    // Node Card
    node.append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", (d: any) => {
        if (d.depth === 0) return "#ffffff"; // CEO white
        if (d.data.role === 'VP') return "#1e293b"; // Team header dark
        if (d.data.role === 'TEAM_LEADER') return "#0f766e"; // Manager teal
        return "#4d7c0f"; // Staff green
      })
      .attr("stroke", (d: any) => d.depth === 0 ? "#475569" : "none")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))");

    // Avatar for Root
    const rootNode = node.filter((d: any) => d.depth === 0);
    rootNode.append("circle")
      .attr("cy", -65)
      .attr("r", 40)
      .attr("fill", "#fff")
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 2);
    
    rootNode.append("text")
      .attr("dy", -60)
      .attr("text-anchor", "middle")
      .attr("font-size", "35px")
      .text("👤");

    // Text Content
    node.append("text")
      .attr("dy", "-10")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("fill", d => d.depth === 0 ? "#0f172a" : "#ffffff")
      .attr("font-size", "11px")
      .text(d => d.data.displayName);

    node.append("text")
      .attr("dy", "4")
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("fill", d => d.depth === 0 ? "#64748b" : "rgba(255,255,255,0.9)")
      .attr("font-weight", "500")
      .text(d => d.data.role.replace('_', ' '));

    // Metrics (Small)
    node.append("text")
      .attr("dy", "16")
      .attr("text-anchor", "middle")
      .attr("font-size", "7px")
      .attr("fill", d => d.depth === 0 ? "#94a3b8" : "rgba(255,255,255,0.7)")
      .text((d: any) => {
        const m = calculateMetrics(d.data);
        return `₹${(m.revenue / 100000).toFixed(1)}L | ${m.totalLeads} Leads`;
      });

    // Add a small "Click for details" hint
    const hintG = node.append("g")
      .attr("class", "click-hint")
      .attr("fill-opacity", 0.9);

    hintG.append("rect")
      .attr("x", -45)
      .attr("y", 22)
      .attr("width", 90)
      .attr("height", 12)
      .attr("rx", 6)
      .attr("fill", d => d.depth === 0 ? "#3b82f6" : "#ffffff");

    hintG.append("text")
      .attr("y", 31)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("fill", d => d.depth === 0 ? "#ffffff" : "#3b82f6")
      .attr("font-weight", "900")
      .attr("letter-spacing", "0.02em")
      .text("VIEW DETAILS");

  }, [allUsers, onUserClick, calculateMetrics]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4 mt-4">
      <div className="mb-2">
        <h3 className="font-bold text-slate-900 text-sm">Hierarchy Flow Chart</h3>
        <p className="text-[10px] text-slate-500">Vertical flow representation of the team structure</p>
      </div>
      <div className="relative w-full overflow-x-auto no-scrollbar pb-4">
        <div className="min-w-[800px] md:min-w-full">
          <svg ref={svgRef} className="mx-auto w-full h-auto"></svg>
        </div>
      </div>
    </div>
  );
}
