import { ActionPanel, List, Action } from "@raycast/api";
import axios from "axios";
import { useEffect, useState } from "react";

type Animal = "cat" | "dog" | "horse";
type Plant = {
  name: string;
  commonNames: string[];
  scientificName: string;
  family: string | null;
  link: string;
  toxicTo: Animal[];
  imageUrl: string | null;
  toxicPrinciples: string | null;
  clinicalSigns: string | null;
};

const ANIMAL_EMOJI_MAP: Record<Animal, string> = {
  cat: "🐱",
  dog: "🐶",
  horse: "🐴",
};

export default function Command() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    async function fetchPlants() {
      const res = await axios.get<Plant[]>(
        "https://fourthclasshonours.github.io/toxic-plant-list-scraper/toxicPlants.json"
      );
      setPlants(res.data);
    }

    fetchPlants();
  }, []);

  return (
    <List isShowingDetail searchBarPlaceholder="Enter a plant name..." navigationTitle="Is It Toxic To?">
      <List.EmptyView
        icon="🪴"
        title="Can't find your plant?"
        description="Try searching it's scientific name instead"
      />
      {plants.map((plant, index) => (
        <List.Item
          key={index}
          title={plant.name}
          subtitle={plant.scientificName}
          keywords={[...plant.commonNames, plant.scientificName]}
          accessories={[
            {
              text: plant.toxicTo.map((animal) => ANIMAL_EMOJI_MAP[animal]).join(" "),
            },
          ]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="Full details" url={plant.link} />
            </ActionPanel>
          }
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Name" text={plant.name} />
                  <List.Item.Detail.Metadata.Label title="Scientific Name" text={plant.scientificName} />
                  {plant.family !== null && <List.Item.Detail.Metadata.Label title="Family" text={plant.family} />}
                  {plant.commonNames.length > 0 && (
                    <List.Item.Detail.Metadata.TagList title="Common Names">
                      {plant.commonNames.map((commonName, index) => (
                        <List.Item.Detail.Metadata.TagList.Item key={index} text={commonName} />
                      ))}
                    </List.Item.Detail.Metadata.TagList>
                  )}
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.TagList title="Toxic to">
                    {plant.toxicTo.map((animal, index) => (
                      <List.Item.Detail.Metadata.TagList.Item
                        key={index}
                        text={`${ANIMAL_EMOJI_MAP[animal]} ${animal[0].toUpperCase()}${animal
                          .substring(1)
                          .toLowerCase()}`}
                      />
                    ))}
                  </List.Item.Detail.Metadata.TagList>
                  {plant.toxicPrinciples !== null && (
                    <List.Item.Detail.Metadata.Label title="Toxic Principles" text={plant.toxicPrinciples} />
                  )}
                  {plant.clinicalSigns !== null && (
                    <List.Item.Detail.Metadata.Label title="Clinical Signs" text={plant.clinicalSigns} />
                  )}
                  <List.Item.Detail.Metadata.Separator />
                  <List.Item.Detail.Metadata.Link title="Full details" text="ASPCA website" target={plant.link} />
                </List.Item.Detail.Metadata>
              }
            />
          }
        />
      ))}
    </List>
  );
}
