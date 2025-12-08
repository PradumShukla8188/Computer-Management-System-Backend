import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Country, State, City, Timezone } from "src/models";
import { counties } from './country.data';
import { states } from './state.data';
import { cities } from './city.data';
import { timezones } from './timezone.data';


@Injectable()
export class CountrySeeder {
    constructor(
        @InjectModel(Country.name) private CountryModel: Model<Country>,
        @InjectModel(State.name) private StateModel: Model<State>,
        @InjectModel(City.name) private CityModel: Model<City>,
        @InjectModel(Timezone.name) private TimezoneModel: Model<Timezone>,

    ) { }

    async init() {
        try {
            await this.CountryModel.deleteMany({});
            await this.StateModel.deleteMany({});
            await this.CityModel.deleteMany({});
            await this.TimezoneModel.deleteMany({});

            await this.CountryModel.insertMany(counties);
            await this.StateModel.insertMany(states);
            await this.CityModel.insertMany(cities);
            await this.TimezoneModel.insertMany(timezones);

            let allStates = await this.StateModel.find({});
            for (let i = 0; i < allStates.length; i++) {
                const element = allStates[i];
                this.CountryModel.findOne({ id: element.countryId }, { id: 1 }).then((e) => {
                    if (e) {
                        element.countryMId = e._id;
                        element.save();
                    }
                })
            }

            let allCities = await this.CityModel.find({});
            for (let i = 0; i < allCities.length; i++) {
                const element = allCities[i];
                let s = await this.StateModel.findOne({ id: element.stateId }, { id: 1 })
                if (s) {
                    console.log("e._id", s._id);

                    element.statemId = s._id;
                    await element.save()
                }
            }


        } catch (error) {
            return Promise.reject(error);
        }
    }
}