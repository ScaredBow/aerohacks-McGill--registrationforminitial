import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    age_group: "",
    school: "",
    school_other: "",
    mcgill_email: "",
    mcgill_student_id: "",
    discord_username: "",
    team_mode: "",
    team_name: "",
    captain_email: "",
    fields_of_study: [],
    interests: [],
    other_interest: "",
    dietary_restrictions: [],
    other_dietary: "",
    accessibility_needs: "",
    mlh_code_of_conduct: false,
    mlh_privacy_policy: false,
    mlh_emails: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const mcgillEmailRegex = /@(mcgill\.ca|mail\.mcgill\.ca)$/i;
  const discordRegex = /^[a-z0-9._]{2,32}$/;
  const ageGroupOptions = ["Under 18", "18-20", "21-24", "25-29", "30+"];
  const schoolOptions = [
    "McGill University",
    "Concordia University",
    "Université de Montréal",
    "Polytechnique Montréal",
    "HEC Montréal",
    "UQAM",
    "ÉTS",
    "Dawson College",
    "John Abbott College",
    "Marianopolis College",
    "Vanier College",
    "Champlain College (St-Lambert)",
    "Cégep du Vieux Montréal",
    "Cégep de Maisonneuve",
    "Cégep André-Laurendeau",
    "Cégep Ahuntsic",
    "Cégep Rosemont",
    "Collège de Bois-de-Boulogne",
    "Université Laval",
    "Université de Sherbrooke",
    "Bishop’s University",
    "UQTR",
    "UQO",
    "Other"
  ];
  const fieldsOfStudyOptions = [
    "Aerospace Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Computer Engineering",
    "Software Engineering",
    "Computer Science",
    "Physics",
    "Mathematics",
    "Biology / Life Sciences",
    "Business / Management",
    "Economics",
    "Other"
  ];
  const interestOptions = [
    "Drones / UAVs",
    "Aerospace Systems",
    "Robotics",
    "Embedded Systems",
    "Hardware Hacking",
    "AI / Machine Learning",
    "Computer Vision",
    "Data Science",
    "Sustainability",
    "Healthcare / MedTech",
    "Defense / Security",
    "Entrepreneurship / Startups",
    "Other"
  ];
  const dietaryOptions = [
    "None",
    "Vegetarian",
    "Vegan",
    "Halal",
    "Kosher",
    "Gluten-free",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (!formData.phone_number.trim() || !formData.age_group || !formData.school) {
      setError("Please complete all required fields.");
      return;
    }

    if (!formData.team_mode) {
      setError("Please select how you are participating.");
      return;
    }

    if (formData.team_mode === "team" && !formData.team_name.trim()) {
      setError("Team name is required when registering with a team.");
      return;
    }

    if (!formData.fields_of_study.length) {
      setError("Please select at least one field of study.");
      return;
    }

    if (!formData.interests.length) {
      setError("Please select at least one topic of interest.");
      return;
    }

    if (formData.school === "Other" && !formData.school_other.trim()) {
      setError("Please provide your school name.");
      return;
    }

    if (formData.school === "McGill University") {
      if (!formData.mcgill_email.trim()) {
        setError("McGill email is required for McGill students.");
        return;
      }

      if (!mcgillEmailRegex.test(formData.mcgill_email.trim())) {
        setError("McGill email must end with @mcgill.ca or @mail.mcgill.ca.");
        return;
      }
    }

    if (formData.discord_username.trim() && !discordRegex.test(formData.discord_username.trim())) {
      setError("Discord username must be 2-32 characters and contain only lowercase letters, numbers, dots, or underscores.");
      return;
    }

    // Validate required MLH checkboxes
    if (!formData.mlh_code_of_conduct || !formData.mlh_privacy_policy) {
      setError("You must agree to the MLH Code of Conduct and Privacy Policy to register.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const endpoint = import.meta.env.VITE_REGISTRATION_ENDPOINT || "/api/register";

      if (endpoint) {
        const payload = {
          ...formData,
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim(),
          phone_number: formData.phone_number.trim(),
          school_other: formData.school === "Other" ? formData.school_other.trim() : "",
          mcgill_email: formData.school === "McGill University" ? formData.mcgill_email.trim() : "",
          mcgill_student_id: formData.school === "McGill University" ? formData.mcgill_student_id.trim() : "",
          discord_username: formData.discord_username.trim(),
          team_mode: formData.team_mode,
          team_name: formData.team_mode === "team" ? formData.team_name.trim() : "",
          captain_email: formData.team_mode === "team" ? formData.captain_email.trim() : "",
          fields_of_study: formData.fields_of_study,
          interests: formData.interests,
          other_interest: formData.other_interest.trim(),
          dietary_restrictions: formData.dietary_restrictions,
          other_dietary: formData.other_dietary.trim(),
          accessibility_needs: formData.accessibility_needs.trim()
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const { error: responseError } = await response.json().catch(() => ({}));
          throw new Error(responseError || "Registration request failed");
        }
      } else {
        // Fallback to a client-only success flow when no endpoint is configured
        await new Promise((resolve) => setTimeout(resolve, 400));
        console.info("Registration data captured (not sent to a remote service):", formData);
      }

      setIsSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        age_group: "",
        school: "",
        school_other: "",
        mcgill_email: "",
        mcgill_student_id: "",
        discord_username: "",
        team_mode: "",
        team_name: "",
        captain_email: "",
        fields_of_study: [],
        interests: [],
        other_interest: "",
        dietary_restrictions: [],
        other_dietary: "",
        accessibility_needs: "",
        mlh_code_of_conduct: false,
        mlh_privacy_policy: false,
        mlh_emails: false
      });
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Registration error:", error);
      setError(error?.message || "An error occurred. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => {
      const current = prev[field];
      if (!Array.isArray(current)) return prev;
      const exists = current.includes(value);
      const nextValues = exists ? current.filter((item) => item !== value) : [...current, value];
      return { ...prev, [field]: nextValues };
    });
    setError("");
  };

  return (
    <section id="register" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Register for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500">AeroHacks</span>
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Registration is open to everyone — McGill students are welcome but not required.
          </p>
          <p className="text-gray-500">
            March 13 - March 15, 2026
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h3>
              <p className="text-xl text-gray-600 mb-8">
                Thanks for registering for AeroHacks! We'll follow up with event details soon.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
              >
                Register Another Person
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="shadow-xl border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Registration Information</CardTitle>
                  <CardDescription>Enter your details to register for AeroHacks.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => handleChange("first_name", e.target.value)}
                          required
                          placeholder="John"
                          aria-required="true"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => handleChange("last_name", e.target.value)}
                          required
                          placeholder="Doe"
                          aria-required="true"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Phone Number *</Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => handleChange("phone_number", e.target.value)}
                        required
                        placeholder="+1 555 123 4567"
                        aria-required="true"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                        placeholder="john.doe@example.com"
                        aria-required="true"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="age_group">Age Group *</Label>
                        <Select
                          value={formData.age_group}
                          onValueChange={(value) => handleChange("age_group", value)}
                        >
                          <SelectTrigger id="age_group" aria-required="true">
                            <SelectValue placeholder="Select your age group" />
                          </SelectTrigger>
                          <SelectContent>
                            {ageGroupOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school">School *</Label>
                        <Select
                          value={formData.school}
                          onValueChange={(value) => handleChange("school", value)}
                        >
                          <SelectTrigger id="school" aria-required="true">
                            <SelectValue placeholder="Select your school" />
                          </SelectTrigger>
                          <SelectContent>
                            {schoolOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>How are you participating? *</Label>
                      <RadioGroup
                        value={formData.team_mode}
                        onValueChange={(value) => handleChange("team_mode", value)}
                        className="space-y-2"
                      >
                        <label className="flex items-center space-x-3 text-sm text-gray-700">
                          <RadioGroupItem value="team" id="team_mode_team" />
                          <span>I already have a team</span>
                        </label>
                        <label className="flex items-center space-x-3 text-sm text-gray-700">
                          <RadioGroupItem value="free_agent" id="team_mode_free_agent" />
                          <span>I’m looking for a team (free agent)</span>
                        </label>
                      </RadioGroup>
                    </div>

                    {formData.team_mode === "team" && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="team_name">Team Name *</Label>
                          <Input
                            id="team_name"
                            value={formData.team_name}
                            onChange={(e) => handleChange("team_name", e.target.value)}
                            required
                            placeholder="Team Aero"
                            aria-required="true"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="captain_email">Captain’s Email Address</Label>
                          <Input
                            id="captain_email"
                            type="email"
                            value={formData.captain_email}
                            onChange={(e) => handleChange("captain_email", e.target.value)}
                            placeholder="captain@example.com"
                          />
                          <p className="text-xs text-gray-500">Captain’s email (optional)</p>
                        </div>
                      </div>
                    )}

                    {formData.school === "Other" && (
                      <div className="space-y-2">
                        <Label htmlFor="school_other">School Name *</Label>
                        <Input
                          id="school_other"
                          value={formData.school_other}
                          onChange={(e) => handleChange("school_other", e.target.value)}
                          required
                          placeholder="Your school name"
                          aria-required="true"
                        />
                      </div>
                    )}

                    {formData.school === "McGill University" && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="mcgill_email">McGill Email *</Label>
                          <Input
                            id="mcgill_email"
                            type="email"
                            value={formData.mcgill_email}
                            onChange={(e) => handleChange("mcgill_email", e.target.value)}
                            required
                            placeholder="name@mail.mcgill.ca"
                            aria-required="true"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mcgill_student_id">McGill Student ID (Optional)</Label>
                          <Input
                            id="mcgill_student_id"
                            value={formData.mcgill_student_id}
                            onChange={(e) => handleChange("mcgill_student_id", e.target.value)}
                            placeholder="260123456"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="discord_username">Discord Username (Optional)</Label>
                      <Input
                        id="discord_username"
                        value={formData.discord_username}
                        onChange={(e) => handleChange("discord_username", e.target.value)}
                        placeholder="username"
                      />
                      <p className="text-xs text-gray-500">Lowercase letters, numbers, dots, and underscores only.</p>
                    </div>

                    <div className="space-y-3">
                      <Label>Field(s) of study (select all that apply) *</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {fieldsOfStudyOptions.map((option) => (
                          <label key={option} className="flex items-center space-x-3 text-sm text-gray-700">
                            <Checkbox
                              checked={formData.fields_of_study.includes(option)}
                              onCheckedChange={() => toggleSelection("fields_of_study", option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>What topics are you interested in? *</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {interestOptions.map((option) => (
                          <label key={option} className="flex items-center space-x-3 text-sm text-gray-700">
                            <Checkbox
                              checked={formData.interests.includes(option)}
                              onCheckedChange={() => toggleSelection("interests", option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="other_interest">Other interest (optional)</Label>
                      <Input
                        id="other_interest"
                        value={formData.other_interest}
                        onChange={(e) => handleChange("other_interest", e.target.value)}
                        placeholder="Share any other interests"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Dietary Restrictions (optional)</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {dietaryOptions.map((option) => (
                          <label key={option} className="flex items-center space-x-3 text-sm text-gray-700">
                            <Checkbox
                              checked={formData.dietary_restrictions.includes(option)}
                              onCheckedChange={() => toggleSelection("dietary_restrictions", option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="other_dietary">Other dietary restrictions (optional)</Label>
                        <Input
                          id="other_dietary"
                          value={formData.other_dietary}
                          onChange={(e) => handleChange("other_dietary", e.target.value)}
                          placeholder="Share other dietary needs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accessibility_needs">Accessibility Concerns (optional)</Label>
                      <Textarea
                        id="accessibility_needs"
                        value={formData.accessibility_needs}
                        onChange={(e) => handleChange("accessibility_needs", e.target.value)}
                        placeholder="Let us know about any accessibility needs so we can accommodate you."
                      />
                      <p className="text-xs text-gray-500">Let us know about any accessibility needs so we can accommodate you.</p>
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                        We are currently in the process of partnering with MLH. The following checkboxes are for this partnership. If we do not end up partnering with MLH, your information will not be shared.
                      </p>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="mlh_code_of_conduct"
                          checked={formData.mlh_code_of_conduct}
                          onCheckedChange={(checked) => handleChange("mlh_code_of_conduct", checked)}
                          required
                          aria-required="true"
                        />
                        <label
                          htmlFor="mlh_code_of_conduct"
                          className="text-sm text-gray-700 leading-tight cursor-pointer"
                        >
                          I have read and agree to the{" "}
                          <a
                            href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:text-cyan-700 underline"
                          >
                            MLH Code of Conduct
                          </a>
                          . *
                        </label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="mlh_privacy_policy"
                          checked={formData.mlh_privacy_policy}
                          onCheckedChange={(checked) => handleChange("mlh_privacy_policy", checked)}
                          required
                          aria-required="true"
                        />
                        <label
                          htmlFor="mlh_privacy_policy"
                          className="text-sm text-gray-700 leading-tight cursor-pointer"
                        >
                          I authorize you to share my application/registration information with Major League Hacking for event administration, ranking, and MLH administration in-line with the{" "}
                          <a
                            href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:text-cyan-700 underline"
                          >
                            MLH Privacy Policy
                          </a>
                          . I further agree to the terms of both the{" "}
                          <a
                            href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:text-cyan-700 underline"
                          >
                            MLH Contest Terms and Conditions
                          </a>{" "}
                          and the{" "}
                          <a
                            href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:text-cyan-700 underline"
                          >
                            MLH Privacy Policy
                          </a>
                          . *
                        </label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="mlh_emails"
                          checked={formData.mlh_emails}
                          onCheckedChange={(checked) => handleChange("mlh_emails", checked)}
                        />
                        <label
                          htmlFor="mlh_emails"
                          className="text-sm text-gray-700 leading-tight cursor-pointer"
                        >
                          I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements.
                        </label>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
                        <p className="text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-6 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
