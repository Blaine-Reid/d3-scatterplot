

//XHR to get the JSON file
let req = new XMLHttpRequest()
req.open('GET', './resources/json/cyclist-data.json', true)
req.send()
req.onload = function () {
  //parse file into useable array
  let json = JSON.parse(req.responseText)

  //parse data into numbers and strings as needed
  json.forEach(d => {
    d.Place = +d.Place
    d.Seconds = +d.Seconds
    d.Year = d.Year.toString()
  })

  render(json)
}


const render = data => {
  //sample data
  // {
  //   "Time": "36:55",
  //   "Place": 2,
  //   "Seconds": 2215,
  //   "Name": "Marco Pantani",
  //   "Year": 1997,
  //   "Nationality": "ITA",
  //   "Doping": "Alleged drug use during 1997 due to high hermatocrit levels",
  //   "URL": "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
  // },

    //create variables containing the width and height
  //set to the users display
  const width = document.body.clientWidth
  const height =document.body.clientHeight

  //create the main svg element to append our bar chart to
  const svg = d3.select('body')
    .append('svg')
    //make the width change based on width of users client width
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'chart')

  //specifier used for the tymeParse argument
  const specifier = "%M:%S"

  //xValues and labels
  const xValue = d => d.Year
  const xAxisLabel = 'Year'

  //yValue and labels
  const yValue = data.map(d => d3.timeParse(specifier)(d.Time))
  const yAxisLabel = 'Time in Minutes'

  //misc variables to easily change
  const chartTitle = `Doping in Professional Bicycle Racing`

  //margin of svg
  const margin = {
    top: 80,
    bottom: 100,
    left: 160,
    right: 40
  }

  //inner dimensions calculated
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  //circle colors
  const noDopingColor = "#BA5F06"
  const dopingColor = "steelblue"
  //circle radius
  const radius = 8


  //format the xAxis into NO FORMATTING for years
  const xAxisTickFormat = number => d3.format("")(number)
  //format the yAxis for time
  const yAxisTickFormat = number => d3.timeFormat(specifier)(number)

  //=================SCALES===================
  const xScale = d3.scaleLinear()
    .domain([1993, d3.max(data, xValue)])
    .range([0, innerWidth])
    .nice()

  const yScale = d3.scaleTime()
    .domain(d3.extent(yValue))
    .range([0, innerHeight])
    .nice()

  //================= AXIS =====================
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight)
    .tickPadding(20)


  const yAxis = d3.axisLeft(yScale)
    // .tickValues(parsedData)
    .tickFormat(yAxisTickFormat)
    .tickSize(-innerWidth)
    .tickPadding(10)


  //=================== X-AXIS ==================
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)


  //create the x-axis scale
  const xAxisGroup = g.append('g').call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)

  //remove the domain tick
  xAxisGroup.select('.domain').remove()


  //create the x-axis label
  xAxisGroup.append('text')
    .text(xAxisLabel)
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 80)

  //=================== Y-AXIS ==================
  const yAxisGroup = g.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .selectAll('.domain')
    .remove()

  //couldn't append to yAxisGroup?!??!
  //won't show up for some reason when appended to yAxisGroup
  g.append('text')
    .text(yAxisLabel)
    .attr('class', 'axis-label')
    .attr('x', -innerHeight / 2)
    .attr('y', -80)
    .attr('transform', 'rotate(-90)')
    //class wasn't changing size?!?!?
    .style('font-size', '3em')


  //=================== DATA ==================
  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    //create custom data- attributes
    .attr('data-xvalue', d => parseInt(d.Year))
    .attr('data-yvalue', d => d3.timeParse(specifier)(d.Time))
    //using the yScale, we pass the timeParse method to determine the location of the Time key
    .attr('cy', d => yScale(d3.timeParse(specifier)(d.Time)))
    //using the xScale we parse the Year
    .attr('cx', d => xScale(d.Year))
    .attr('r', radius)
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    //if the Doping key of the object is empty then color the circle with the noDopingColor
    //else using dopingColor
    .style('fill', d => d.Doping === "" ? noDopingColor : dopingColor)
    .append('title')
    //create a data-year attribute
    .attr('data-year', d => parseInt(d.Year))
    //display the name of the rider and year when hovering over a data point
    .text(d => `Name: ${d.Name}\nYear: ${d.Year}`)


  //=================== CHART TITLE ==================
  g.append('text')
    .text(chartTitle)
    .attr('id', 'title')
    .attr('y', -25)

  //=================== CHART LEGEND ==================
  const legend = g.append('g')
    .attr("transform", `translate(${innerWidth - 30},${innerHeight / 2 - 10})`)
    .attr('id', 'legend')

  legend.append('text')
    .text('No doping allegations')
    .attr('text-anchor', 'end')

  legend.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', noDopingColor)
    .attr('x', 5)
    .attr('y', -15)
  legend.append('text')
    .text('Riders with doping allegations')
    .attr('text-anchor', 'end')
    .attr('x', 0)
    .attr('y', 30)
  legend.append('rect')
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', dopingColor)
    .attr('x', 5)
    .attr('y', 15)

}


