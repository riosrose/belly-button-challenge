const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

function updateMetadata(sampleid) {
  d3.json(url).then((data) => {
      console.log("Metadata array:", data.metadata); // Log the metadata array

      // Get the metadata field
      let metadata = data.metadata;

      // Filter the metadata for the object with the desired sample number
      let sample_metadata = metadata.filter(metaObj => metaObj.id === parseInt(sampleid))[0];

      // Log the filtered sample metadata
      console.log("Filtered sample metadata:", sample_metadata); // Log the filtered metadata

      // Use d3 to select the panel with id of `#sample-metadata`
      let panel = d3.select("#sample-metadata");

      // Use `.html("")` to clear any existing metadata
      panel.html("");

      // Check if sample_metadata exists
      if (sample_metadata) {
          // Inside a loop, append new tags for each key-value in the filtered metadata
          Object.entries(sample_metadata).forEach(([key, value]) => {
              panel.append("p").text(`${key.toUpperCase()}: ${value}`);
          });
      } else {
          panel.append("p").text("No metadata found for this sample.");
      }
  }).catch(error => {
      console.error("Error fetching metadata:", error);
  });
}
// Call the init function to load data and populate the dropdown
init();

function optionChanged(newSample) {
console.log("Selected sample:", newSample); // Log the selected sample ID
buildCharts(newSample); // Call the function to build charts
updateMetadata(newSample); // Call the function to update metadata
}

// Build both charts
function buildCharts(sampleid) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let sample = samples.filter(sample => sample.id === sampleid)[0];

    // Obtain the otu_ids, otu_labels, and sample_values
    let otuIds = sample.otu_ids;
    let otuLabels = sample.otu_labels;
    let sampleValues = sample.sample_values;

    // Create a Bubble Chart
    let bubbleChartTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Viridis' // Optional: you can specify a colorscale
      }
    };

    let bubbleData = [bubbleChartTrace];

    let bubbleLayout = {
      title: 'Bubble Chart of Sample Values',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' },
      showlegend: false,
      height: 600,
      width: 1200
    };

    // Display the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Map the otu_ids to a list of strings for your yticks in the Bar Chart 
    let yticks = otuIds.map(otuId => `OTU ${otuId}`);

    // Create a Bar Chart
    let barChartTrace = {
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
    };

    let barChartData = [barChartTrace];

    // Display  the Bar Chart
    Plotly.newPlot('bar', barChartData);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    names.forEach((sample) => {
      dropdownMenu.append("option")
        .text(sample)  // Set the text of the option to the sample name
        .property("value", sample);  // Set the value attribute of the option to the sample name
    });

    // Get the first sample from the list
    let firstSample = names[0]; // Use 'names' here

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample); // Use 'firstSample' instead of 'newSample'
    updateMetadata(firstSample); // Use 'firstSample' instead of 'newSample'
  }); // Correctly close the then() function
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Initialize the dashboard
init();
