package com.voyagereserv.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.voyagereserv.IntegrationTest;
import com.voyagereserv.domain.Vol;
import com.voyagereserv.repository.VolRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VolResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VolResourceIT {

    private static final String DEFAULT_COMPAGNIE = "AAAAAAAAAA";
    private static final String UPDATED_COMPAGNIE = "BBBBBBBBBB";

    private static final String DEFAULT_HORAIRE = "AAAAAAAAAA";
    private static final String UPDATED_HORAIRE = "BBBBBBBBBB";

    private static final Double DEFAULT_TARIF = 1D;
    private static final Double UPDATED_TARIF = 2D;

    private static final Integer DEFAULT_SIEGES_DISPONIBLES = 1;
    private static final Integer UPDATED_SIEGES_DISPONIBLES = 2;

    private static final String ENTITY_API_URL = "/api/vols";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VolRepository volRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVolMockMvc;

    private Vol vol;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vol createEntity(EntityManager em) {
        Vol vol = new Vol()
            .compagnie(DEFAULT_COMPAGNIE)
            .horaire(DEFAULT_HORAIRE)
            .tarif(DEFAULT_TARIF)
            .siegesDisponibles(DEFAULT_SIEGES_DISPONIBLES);
        return vol;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vol createUpdatedEntity(EntityManager em) {
        Vol vol = new Vol()
            .compagnie(UPDATED_COMPAGNIE)
            .horaire(UPDATED_HORAIRE)
            .tarif(UPDATED_TARIF)
            .siegesDisponibles(UPDATED_SIEGES_DISPONIBLES);
        return vol;
    }

    @BeforeEach
    public void initTest() {
        vol = createEntity(em);
    }

    @Test
    @Transactional
    void createVol() throws Exception {
        int databaseSizeBeforeCreate = volRepository.findAll().size();
        // Create the Vol
        restVolMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vol)))
            .andExpect(status().isCreated());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeCreate + 1);
        Vol testVol = volList.get(volList.size() - 1);
        assertThat(testVol.getCompagnie()).isEqualTo(DEFAULT_COMPAGNIE);
        assertThat(testVol.getHoraire()).isEqualTo(DEFAULT_HORAIRE);
        assertThat(testVol.getTarif()).isEqualTo(DEFAULT_TARIF);
        assertThat(testVol.getSiegesDisponibles()).isEqualTo(DEFAULT_SIEGES_DISPONIBLES);
    }

    @Test
    @Transactional
    void createVolWithExistingId() throws Exception {
        // Create the Vol with an existing ID
        vol.setId(1L);

        int databaseSizeBeforeCreate = volRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVolMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vol)))
            .andExpect(status().isBadRequest());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVols() throws Exception {
        // Initialize the database
        volRepository.saveAndFlush(vol);

        // Get all the volList
        restVolMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vol.getId().intValue())))
            .andExpect(jsonPath("$.[*].compagnie").value(hasItem(DEFAULT_COMPAGNIE)))
            .andExpect(jsonPath("$.[*].horaire").value(hasItem(DEFAULT_HORAIRE)))
            .andExpect(jsonPath("$.[*].tarif").value(hasItem(DEFAULT_TARIF.doubleValue())))
            .andExpect(jsonPath("$.[*].siegesDisponibles").value(hasItem(DEFAULT_SIEGES_DISPONIBLES)));
    }

    @Test
    @Transactional
    void getVol() throws Exception {
        // Initialize the database
        volRepository.saveAndFlush(vol);

        // Get the vol
        restVolMockMvc
            .perform(get(ENTITY_API_URL_ID, vol.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vol.getId().intValue()))
            .andExpect(jsonPath("$.compagnie").value(DEFAULT_COMPAGNIE))
            .andExpect(jsonPath("$.horaire").value(DEFAULT_HORAIRE))
            .andExpect(jsonPath("$.tarif").value(DEFAULT_TARIF.doubleValue()))
            .andExpect(jsonPath("$.siegesDisponibles").value(DEFAULT_SIEGES_DISPONIBLES));
    }

    @Test
    @Transactional
    void getNonExistingVol() throws Exception {
        // Get the vol
        restVolMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVol() throws Exception {
        // Initialize the database
        volRepository.saveAndFlush(vol);

        int databaseSizeBeforeUpdate = volRepository.findAll().size();

        // Update the vol
        Vol updatedVol = volRepository.findById(vol.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVol are not directly saved in db
        em.detach(updatedVol);
        updatedVol.compagnie(UPDATED_COMPAGNIE).horaire(UPDATED_HORAIRE).tarif(UPDATED_TARIF).siegesDisponibles(UPDATED_SIEGES_DISPONIBLES);

        restVolMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVol.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVol))
            )
            .andExpect(status().isOk());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
        Vol testVol = volList.get(volList.size() - 1);
        assertThat(testVol.getCompagnie()).isEqualTo(UPDATED_COMPAGNIE);
        assertThat(testVol.getHoraire()).isEqualTo(UPDATED_HORAIRE);
        assertThat(testVol.getTarif()).isEqualTo(UPDATED_TARIF);
        assertThat(testVol.getSiegesDisponibles()).isEqualTo(UPDATED_SIEGES_DISPONIBLES);
    }

    @Test
    @Transactional
    void putNonExistingVol() throws Exception {
        int databaseSizeBeforeUpdate = volRepository.findAll().size();
        vol.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVolMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vol.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVol() throws Exception {
        int databaseSizeBeforeUpdate = volRepository.findAll().size();
        vol.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVol() throws Exception {
        int databaseSizeBeforeUpdate = volRepository.findAll().size();
        vol.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vol)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVolWithPatch() throws Exception {
        // Initialize the database
        volRepository.saveAndFlush(vol);

        int databaseSizeBeforeUpdate = volRepository.findAll().size();

        // Update the vol using partial update
        Vol partialUpdatedVol = new Vol();
        partialUpdatedVol.setId(vol.getId());

        restVolMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVol.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVol))
            )
            .andExpect(status().isOk());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
        Vol testVol = volList.get(volList.size() - 1);
        assertThat(testVol.getCompagnie()).isEqualTo(DEFAULT_COMPAGNIE);
        assertThat(testVol.getHoraire()).isEqualTo(DEFAULT_HORAIRE);
        assertThat(testVol.getTarif()).isEqualTo(DEFAULT_TARIF);
        assertThat(testVol.getSiegesDisponibles()).isEqualTo(DEFAULT_SIEGES_DISPONIBLES);
    }

    @Test
    @Transactional
    void fullUpdateVolWithPatch() throws Exception {
        // Initialize the database
        volRepository.saveAndFlush(vol);

        int databaseSizeBeforeUpdate = volRepository.findAll().size();

        // Update the vol using partial update
        Vol partialUpdatedVol = new Vol();
        partialUpdatedVol.setId(vol.getId());

        partialUpdatedVol
            .compagnie(UPDATED_COMPAGNIE)
            .horaire(UPDATED_HORAIRE)
            .tarif(UPDATED_TARIF)
            .siegesDisponibles(UPDATED_SIEGES_DISPONIBLES);

        restVolMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVol.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVol))
            )
            .andExpect(status().isOk());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
        Vol testVol = volList.get(volList.size() - 1);
        assertThat(testVol.getCompagnie()).isEqualTo(UPDATED_COMPAGNIE);
        assertThat(testVol.getHoraire()).isEqualTo(UPDATED_HORAIRE);
        assertThat(testVol.getTarif()).isEqualTo(UPDATED_TARIF);
        assertThat(testVol.getSiegesDisponibles()).isEqualTo(UPDATED_SIEGES_DISPONIBLES);
    }

    @Test
    @Transactional
    void patchNonExistingVol() throws Exception {
        int databaseSizeBeforeUpdate = volRepository.findAll().size();
        vol.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVolMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vol.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVol() throws Exception {
        int databaseSizeBeforeUpdate = volRepository.findAll().size();
        vol.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vol))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVol() throws Exception {
        int databaseSizeBeforeUpdate = volRepository.findAll().size();
        vol.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVolMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vol)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vol in the database
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVol() throws Exception {
        // Initialize the database
        volRepository.saveAndFlush(vol);

        int databaseSizeBeforeDelete = volRepository.findAll().size();

        // Delete the vol
        restVolMockMvc.perform(delete(ENTITY_API_URL_ID, vol.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vol> volList = volRepository.findAll();
        assertThat(volList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
