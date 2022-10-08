import { ActionPanel, List, Action } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";

type Plant = {
  name: string;
  commonNames: string[];
  scientificName: string;
  family: string | null;
  link: string;
};

export default function Command() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    async function fetchPlants() {
      const res = await axios.get<{ Cats: Plant[] }>("https://fourthclasshonours.github.io/toxic-plant-list-scraper/toxicPlants.json");
      setPlants(res.data["Cats"]);
    }

    fetchPlants();
  }, []);

  return (
    <List isShowingDetail>
      {plants.map((plant, index) => (
        <List.Item
          key={index}
          title={plant.name}
          subtitle={plant.scientificName}
          accessories={[
            { text: "🐱"},
          ]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="More details" url={plant.link} />
            </ActionPanel>
          }
          detail={
            <List.Item.Detail metadata={
              <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Label title="Scientific Name" text={plant.scientificName} />
                {plant.family !== null && (
                  <List.Item.Detail.Metadata.Label title="Family" text={plant.family} />
                )}
                {plant.commonNames.length > 0 && (
                  <List.Item.Detail.Metadata.TagList title="Common Names">
                    {plant.commonNames.map((commonName, index) => (
                      <List.Item.Detail.Metadata.TagList.Item key={index} text={commonName} />
                      ))}
                  </List.Item.Detail.Metadata.TagList>
                )}
                <List.Item.Detail.Metadata.Separator />
                <List.Item.Detail.Metadata.Link title="Link" text="More details" target={plant.link} />
              </List.Item.Detail.Metadata>
            } />
          }
        />
        ))}
      </List>
  );
}
